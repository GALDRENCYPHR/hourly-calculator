document.addEventListener("DOMContentLoaded", () => {
  // Get elements by ID
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

  function calculatePay() {
    let hourlyRate = parseFloat(hourlyRateInput.value) || 0;
    let hoursWorked = parseFloat(hoursWorkedInput.value) || 0;
    let overtimeHours = parseFloat(overtimeHoursInput.value) || 0;
    let deductions = parseFloat(deductionsInput.value) || 0;

    let regularPay = hourlyRate * hoursWorked;
    let overtimePay = overtimeHours * hourlyRate * 1.5;
    let totalPay = regularPay + overtimePay;
    let netPay = totalPay - deductions;

    totalPayDisplay.textContent = `$${totalPay.toFixed(2)}`;
    netPayDisplay.textContent = `$${netPay.toFixed(2)}`;
  }

  function calculateHours() {
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    let breakDuration = parseFloat(breakDurationInput.value) || 0;

    if (!startTime || !endTime) {
      alert("Please enter both start and end times.");
      return;
    }

    const start = new Date(`2023-01-01T${startTime}`);
    const end = new Date(`2023-01-01T${endTime}`);

    if (end < start) {
      alert("End time must be after start time.");
      return;
    }

    let totalHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    totalHours -= breakDuration / 60; // Subtract break time

    calculatedHoursDisplay.textContent = totalHours.toFixed(2);
    hoursWorkedInput.value = totalHours.toFixed(2); // Auto-fill in hours worked field
    calculatePay(); // Recalculate pay
  }

  function showTab(tabId) {
    // Hide all tab content
    document.querySelectorAll(".tab-content").forEach(tab => {
      tab.style.display = "none";
    });
  
    // Show the selected tab content
    document.getElementById(tabId).style.display = "block";
  
    // Update the active tab
    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.remove("active");
    });
  
    // Add active class to the clicked tab
    const clickedTab = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    clickedTab.classList.add("active");
  
    // Move the underline
    updateUnderline(clickedTab);
  }
  
  function updateUnderline(activeTab) {
    const underline = document.querySelector(".tab-underline");
    underline.style.width = `${activeTab.offsetWidth}px`;
    underline.style.left = `${activeTab.offsetLeft}px`;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Add an underline div
    const tabsContainer = document.querySelector(".tabs");
    const underline = document.createElement("div");
    underline.classList.add("tab-underline");
    tabsContainer.appendChild(underline);
  
    // Set initial position
    const activeTab = document.querySelector(".tab.active");
    if (activeTab) updateUnderline(activeTab);
  });
  // Attach event listeners
  [hourlyRateInput, hoursWorkedInput, overtimeHoursInput, deductionsInput].forEach(input => {
    input.addEventListener("input", calculatePay);
  });

  window.calculateHours = calculateHours;
  window.showTab = showTab;
});
