document.addEventListener("DOMContentLoaded", () => {
  const hourlyRateInput = document.getElementById("hourly-rate");
  const hoursWorkedInput = document.getElementById("hours-worked");
  const overtimeHoursInput = document.getElementById("overtime-hours");
  const deductionsInput = document.getElementById("deductions");
  const totalPayDisplay = document.getElementById("total-pay");
  const netPayDisplay = document.getElementById("net-pay");
  const startTimeInput = document.getElementById("start-time");
  const endTimeInput = document.getElementById("end-time");
  const breakDurationInput = document.getElementById("break-duration");
  const calculatedHoursDisplay = document.getElementById("calculated-hours");
  const statusMessage = document.getElementById("calculator-error");
  const tabs = document.querySelectorAll(".tab");
  const tabPanels = document.querySelectorAll(".tab-content");
  const calcHoursButton = document.getElementById("calculate-hours-btn");
  const underline = document.querySelector(".tab-underline");
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  const sanitizeNumber = (value) => {
    const parsed = parseFloat(value);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return parsed;
  };

  const setStatusMessage = (message = "") => {
    if (!statusMessage) return;
    statusMessage.textContent = message;
  };

  function calculatePay() {
    const hourlyRate = sanitizeNumber(hourlyRateInput.value);
    const hoursWorked = sanitizeNumber(hoursWorkedInput.value);
    const overtimeHours = sanitizeNumber(overtimeHoursInput.value);
    const deductions = sanitizeNumber(deductionsInput.value);

    const regularPay = hourlyRate * hoursWorked;
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const totalPay = regularPay + overtimePay;
    const netPay = Math.max(totalPay - deductions, 0);

    totalPayDisplay.textContent = currencyFormatter.format(totalPay);
    netPayDisplay.textContent = currencyFormatter.format(netPay);
  }

  function calculateHours() {
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const breakDuration = sanitizeNumber(breakDurationInput.value);

    if (!startTime || !endTime) {
      setStatusMessage("Enter both start and end times to calculate hours.");
      return;
    }

    let start = new Date(`2023-01-01T${startTime}`);
    let end = new Date(`2023-01-01T${endTime}`);

    if (end <= start) {
      end.setDate(end.getDate() + 1); // handle overnight shifts
    }

    let totalHours = (end - start) / (1000 * 60 * 60);
    totalHours -= breakDuration / 60;

    if (totalHours <= 0) {
      setStatusMessage("Break duration cannot exceed total shift length.");
      return;
    }

    const formattedHours = totalHours.toFixed(2);
    calculatedHoursDisplay.textContent = formattedHours;
    hoursWorkedInput.value = formattedHours;
    setStatusMessage("");
    calculatePay();
  }

  function updateUnderline(activeTab) {
    if (!underline || !activeTab) return;
    underline.style.width = `${activeTab.offsetWidth}px`;
    underline.style.left = `${activeTab.offsetLeft}px`;
  }

  function showTab(targetTab) {
    const tabId = targetTab.dataset.tabTarget;
    const panelToShow = document.getElementById(tabId);
    if (!panelToShow) return;

    tabs.forEach(tab => {
      const isActive = tab === targetTab;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach(panel => {
      const isTarget = panel === panelToShow;
      panel.setAttribute("aria-hidden", String(!isTarget));
    });

    updateUnderline(targetTab);
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => showTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      showTab(tab);
    });
  });

  [hourlyRateInput, hoursWorkedInput, overtimeHoursInput, deductionsInput].forEach(input => {
    input.addEventListener("input", calculatePay);
  });

  if (calcHoursButton) {
    calcHoursButton.addEventListener("click", calculateHours);
  }

  document.querySelectorAll(".calculator-form").forEach(form => {
    form.addEventListener("submit", (event) => event.preventDefault());
  });

  const initialTab = document.querySelector(".tab.active") || tabs[0];
  if (initialTab) {
    showTab(initialTab);
  }
  calculatePay();
});
