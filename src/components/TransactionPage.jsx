import { useEffect, useMemo, useState } from "react";
import api, { authConfig, getErrorMessage } from "../services/api";

const expenseCategories = [
  "Housing",
  "Utilities",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Debt Payments",
  "Miscellaneous",
];

const emptyForm = (type) => ({
  description: "",
  amount: "",
  category: type === "expense" ? expenseCategories[0] : "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
});

const recordTypeLabel = (type) => (type === "expense" ? "Expense" : "Income");

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);

const TransactionPage = ({ type, token }) => {
  const isExpense = type === "expense";
  const title = isExpense ? "Expenses" : "Income";
  const endpoint = `/${type}`;
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(() => emptyForm(type));
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;
    api
      .get(endpoint, authConfig(token))
      .then(({ data }) => {
        if (isMounted) {
          setRecords(data.data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getErrorMessage(requestError, `Unable to load ${title.toLowerCase()}.`));
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [endpoint, title, token]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [record.title || record.source, record.category, record.notes]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [records, search]);

  const total = records.reduce((sum, record) => sum + Number(record.amount), 0);

  const resetForm = () => {
    setForm(emptyForm(type));
    setEditingId(null);
  };

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const body = {
      [isExpense ? "title" : "source"]: form.description.trim(),
      amount: Number(form.amount),
      date: form.date,
      notes: form.notes.trim(),
    };
    if (isExpense) {
      body.category = form.category;
    }

    try {
      const response = editingId
        ? await api.put(`${endpoint}/${editingId}`, body, authConfig(token))
        : await api.post(endpoint, body, authConfig(token));
      const savedRecord = response.data.data;

      setRecords((current) =>
        editingId
          ? current.map((record) =>
              record._id === editingId ? savedRecord : record,
            )
          : [savedRecord, ...current],
      );
      setNotice(`${recordTypeLabel(type)} ${editingId ? "updated" : "added"}.`);
      resetForm();
    } catch (requestError) {
      setError(getErrorMessage(requestError, `Unable to save ${title.toLowerCase()}.`));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setForm({
      description: record.title || record.source,
      amount: String(record.amount),
      category: record.category || expenseCategories[0],
      date: new Date(record.date).toISOString().slice(0, 10),
      notes: record.notes || "",
    });
    setNotice("");
    setError("");
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Delete this record? This cannot be undone.")) {
      return;
    }

    setError("");
    setNotice("");
    try {
      await api.delete(`${endpoint}/${recordId}`, authConfig(token));
      setRecords((current) => current.filter((record) => record._id !== recordId));
      if (editingId === recordId) {
        resetForm();
      }
      setNotice(`${recordTypeLabel(type)} deleted.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, `Unable to delete this ${recordTypeLabel(type).toLowerCase()}.`));
    }
  };

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">{title}</h1>
          <p className="text-body-secondary mb-0">
            {isExpense
              ? "Review and manage your spending."
              : "Record and manage your income."}
          </p>
        </div>
        <div className="text-sm-end">
          <div className="small text-body-secondary">Total recorded</div>
          <div className="h4 mb-0">{formatCurrency(total)}</div>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">{editingId ? `Edit ${recordTypeLabel(type)}` : `Add ${recordTypeLabel(type)}`}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor={`${type}-description`}>
                    {isExpense ? "Description" : "Source"}
                  </label>
                  <input
                    className="form-control"
                    id={`${type}-description`}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength="100"
                    required
                  />
                </div>
                {isExpense && (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="expense-category">Category</label>
                    <select
                      className="form-select"
                      id="expense-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      {expenseCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label" htmlFor={`${type}-amount`}>Amount (₹)</label>
                  <input
                    className="form-control"
                    id={`${type}-amount`}
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor={`${type}-date`}>Date</label>
                  <input
                    className="form-control"
                    id={`${type}-date`}
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor={`${type}-notes`}>Notes <span className="text-body-secondary">(optional)</span></label>
                  <textarea
                    className="form-control"
                    id={`${type}-notes`}
                    name="notes"
                    rows="2"
                    maxLength="500"
                    value={form.notes}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit" disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Save changes" : `Add ${recordTypeLabel(type)}`}
                  </button>
                  {editingId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <h2 className="h5 mb-0">Records</h2>
                <label className="visually-hidden" htmlFor={`${type}-search`}>Search records</label>
                <input
                  className="form-control"
                  id={`${type}-search`}
                  type="search"
                  placeholder="Search records"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  style={{ maxWidth: "260px" }}
                />
              </div>
              {loading ? (
                <p className="text-body-secondary mb-0">Loading records...</p>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-5">
                  <p className="mb-1 fw-semibold">
                    {records.length ? "No matching records" : `No ${title.toLowerCase()} records yet`}
                  </p>
                  <p className="text-body-secondary mb-0">
                    {records.length ? "Try another search." : `Add your first ${recordTypeLabel(type).toLowerCase()} using the form.`}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">{isExpense ? "Description" : "Source"}</th>
                        {isExpense && <th scope="col">Category</th>}
                        <th scope="col" className="text-end">Amount</th>
                        <th scope="col"><span className="visually-hidden">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr key={record._id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.title || record.source}</td>
                          {isExpense && <td>{record.category}</td>}
                          <td className="text-end fw-semibold">{formatCurrency(record.amount)}</td>
                          <td className="text-end text-nowrap">
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              type="button"
                              onClick={() => handleEdit(record)}
                              aria-label={`Edit ${record.title || record.source}`}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              type="button"
                              onClick={() => handleDelete(record._id)}
                              aria-label={`Delete ${record.title || record.source}`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionPage;
