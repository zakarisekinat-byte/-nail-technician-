const STORAGE_KEY = "blushBloomBookings";
const getBookings = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveBookings = bookings => localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menuButton && nav) menuButton.addEventListener("click", () => nav.classList.toggle("open"));

  const dateInput = document.getElementById("appointmentDate");
  if (dateInput) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    dateInput.min = localToday;
  }

  const form = document.getElementById("bookingForm");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const bookings = getBookings();
    const duplicate = bookings.some(b => b.date === data.date && b.time === data.time && b.status !== "Cancelled");
    const message = document.getElementById("bookingMessage");
    if (duplicate) {
      message.textContent = "That time slot has already been requested on this device. Please choose another time.";
      message.style.color = "#a34d45";
      return;
    }
    bookings.unshift({...data, id: Date.now().toString(), status: "Pending", createdAt: new Date().toISOString()});
    saveBookings(bookings);
    message.textContent = "Your appointment request has been saved. You can view it under My bookings.";
    message.style.color = "#58805b";
    form.reset();
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  });

  renderCustomerBookings();
  renderDashboard();

  const exportButton = document.getElementById("exportBookings");
  if (exportButton) exportButton.addEventListener("click", exportCSV);
});

function renderCustomerBookings() {
  const container = document.getElementById("customerBookings");
  if (!container) return;
  const bookings = getBookings();
  if (!bookings.length) {
    container.innerHTML = '<div class="empty-state">You have no bookings saved on this device yet.<br>When you request an appointment, it will appear here.</div>';
    return;
  }
  container.innerHTML = bookings.map(b => `
    <article class="booking-card">
      <span class="status">${escapeHTML(b.status)}</span>
      <h3>${escapeHTML(b.service)}</h3>
      <p><strong>Customer:</strong> ${escapeHTML(b.name)}</p>
      <p><strong>Date:</strong> ${escapeHTML(b.date)} at ${escapeHTML(b.time)}</p>
      <p><strong>Technician:</strong> ${escapeHTML(b.technician || "Any available technician")}</p>
      <p><strong>Phone:</strong> ${escapeHTML(b.phone)}</p>
      ${b.notes ? `<p><strong>Notes:</strong> ${escapeHTML(b.notes)}</p>` : ""}
      <div class="card-actions">${b.status !== "Cancelled" && b.status !== "Completed" ? `<button class="small-btn" onclick="cancelBooking('${b.id}')">Cancel request</button>` : ""}</div>
    </article>`).join("");
}
function cancelBooking(id) {
  const bookings = getBookings();
  const item = bookings.find(b => b.id === id);
  if (!item || !confirm("Cancel this appointment request?")) return;
  item.status = "Cancelled";
  saveBookings(bookings);
  renderCustomerBookings();
  renderDashboard();
}
function renderDashboard() {
  const rows = document.getElementById("dashboardRows");
  if (!rows) return;
  const bookings = getBookings();
  document.getElementById("totalBookings").textContent = bookings.length;
  document.getElementById("pendingBookings").textContent = bookings.filter(b => b.status === "Pending").length;
  document.getElementById("confirmedBookings").textContent = bookings.filter(b => b.status === "Confirmed").length;
  document.getElementById("completedBookings").textContent = bookings.filter(b => b.status === "Completed").length;
  if (!bookings.length) {
    rows.innerHTML = '<tr><td colspan="6">No appointment requests yet.</td></tr>';
    return;
  }
  rows.innerHTML = bookings.map(b => `<tr>
    <td>${escapeHTML(b.name)}</td><td>${escapeHTML(b.service)}</td><td>${escapeHTML(b.date)}<br>${escapeHTML(b.time)}</td>
    <td>${escapeHTML(b.phone)}</td><td><span class="status">${escapeHTML(b.status)}</span></td>
    <td>${b.status === "Pending" ? `<button class="small-btn" onclick="updateStatus('${b.id}','Confirmed')">Confirm</button>` : ""}
    ${b.status === "Confirmed" ? `<button class="small-btn" onclick="updateStatus('${b.id}','Completed')">Complete</button>` : ""}
    ${b.status !== "Cancelled" && b.status !== "Completed" ? `<button class="small-btn" onclick="updateStatus('${b.id}','Cancelled')">Cancel</button>` : ""}</td>
  </tr>`).join("");
}
function updateStatus(id, status) {
  const bookings = getBookings();
  const item = bookings.find(b => b.id === id);
  if (!item) return;
  item.status = status;
  saveBookings(bookings);
  renderDashboard();
}
function exportCSV() {
  const bookings = getBookings();
  if (!bookings.length) { alert("There are no bookings to export yet."); return; }
  const columns = ["name","phone","email","service","technician","date","time","status","notes"];
  const csv = [columns.join(","), ...bookings.map(b => columns.map(k => `"${String(b[k] || "").replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "blush-bloom-bookings.csv"; a.click();
  URL.revokeObjectURL(url);
}
