let bmiChartInstance = null;
let bmrChartInstance = null;
let pregChartInstance = null;
let waterChartInstance = null;
let stepsChartInstance = null;

function showCalculator(calcId) {
  document
    .querySelectorAll(".calculator-card")
    .forEach((card) => card.classList.add("d-none"));
  document.getElementById(calcId).classList.remove("d-none");
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));
  document.querySelector(`a[href="#${calcId}"]`).classList.add("active");
}

function convertBMIUnits() {
  const units = document.getElementById("bmiUnits").value;
  const weightInput = document.getElementById("bmiWeight");
  const heightInput = document.getElementById("bmiHeight");
  const weightLabel = document.querySelector('label[for="bmiWeight"]');
  const heightLabel = document.querySelector('label[for="bmiHeight"]');
  const weightError = document.getElementById("bmiWeightError");
  const heightError = document.getElementById("bmiHeightError");

  if (units === "imperial") {
    weightLabel.textContent = "Weight (lb)";
    heightLabel.textContent = "Height (in)";
    weightError.textContent = "Enter valid weight (1–1100 lb).";
    heightError.textContent = "Enter valid height (12–120 in).";
    weightInput.value = Math.round(weightInput.value * 2.20462 * 10) / 10;
    heightInput.value = Math.round((heightInput.value / 2.54) * 10) / 10;
  } else {
    weightLabel.textContent = "Weight (kg)";
    heightLabel.textContent = "Height (cm)";
    weightError.textContent = "Enter valid weight (0.5–500 kg).";
    heightError.textContent = "Enter valid height (30–300 cm).";
    weightInput.value = Math.round((weightInput.value / 2.20462) * 10) / 10;
    heightInput.value = Math.round(heightInput.value * 2.54 * 10) / 10;
  }
}

function calcBMI() {
  const units = document.getElementById("bmiUnits").value;
  const weight = parseFloat(document.getElementById("bmiWeight").value);
  const height = parseFloat(document.getElementById("bmiHeight").value);
  const weightError = document.getElementById("bmiWeightError");
  const heightError = document.getElementById("bmiHeightError");
  const resultDiv = document.getElementById("bmiResult");
  const suggestionsDiv = document.getElementById("bmiSuggestions");

  weightError.style.display = "none";
  heightError.style.display = "none";
  resultDiv.innerHTML = "";
  suggestionsDiv.style.display = "none";
  if (bmiChartInstance) bmiChartInstance.destroy();

  const weightMin = units === "metric" ? 0.5 : 1;
  const weightMax = units === "metric" ? 500 : 1100;
  const heightMin = units === "metric" ? 30 : 12;
  const heightMax = units === "metric" ? 300 : 120;

  if (!weight || weight < weightMin || weight > weightMax) {
    weightError.style.display = "block";
    return;
  }
  if (!height || height < heightMin || height > heightMax) {
    heightError.style.display = "block";
    return;
  }

  let bmi;
  if (units === "metric") {
    bmi = weight / (height / 100) ** 2;
  } else {
    bmi = (weight / height ** 2) * 703;
  }
  bmi = Math.round(bmi * 10) / 10;

  let category, suggestions;
  if (bmi < 18.5) {
    category = "Underweight";
    suggestions = `
      <h3><i class="bi bi-lightbulb"></i> Suggestions</h3>
      <ul>
        <li>Increase calorie intake with nutrient-dense foods like nuts, avocados, and whole grains.</li>
        <li>Consult a dietitian for a personalized plan to gain weight healthily.</li>
        <li>Incorporate strength training to build muscle mass.</li>
      </ul>`;
  } else if (bmi < 25) {
    category = "Normal weight";
    suggestions = `
      <h3><i class="bi bi-lightbulb"></i> Suggestions</h3>
      <ul>
        <li>Maintain a balanced diet with a variety of fruits, vegetables, and lean proteins.</li>
        <li>Engage in regular physical activity (150 min/week moderate exercise).</li>
        <li>Monitor portion sizes to sustain healthy weight.</li>
      </ul>`;
  } else if (bmi < 30) {
    category = "Overweight";
    suggestions = `
      <h3><i class="bi bi-lightbulb"></i> Suggestions</h3>
      <ul>
        <li>Focus on a calorie-controlled diet with high fiber and low processed foods.</li>
        <li>Increase aerobic exercise (e.g., brisk walking, cycling) to 200–300 min/week.</li>
        <li>Consult a healthcare provider for weight management strategies.</li>
      </ul>`;
  } else {
    category = "Obesity";
    suggestions = `
      <h3><i class="bi bi-lightbulb"></i> Suggestions</h3>
      <ul>
        <li>Work with a healthcare professional to create a sustainable weight loss plan.</li>
        <li>Incorporate low-calorie, nutrient-rich foods like vegetables and lean proteins.</li>
        <li>Engage in regular physical activity and consider professional guidance.</li>
      </ul>`;
  }

  resultDiv.innerHTML = `Your BMI is <strong>${bmi}</strong> (${category}).`;
  suggestionsDiv.innerHTML = suggestions;
  suggestionsDiv.style.display = "block";

  const ctx = document.getElementById("bmiChart").getContext("2d");
  document.getElementById("bmiChart").style.display = "block";
  bmiChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Underweight", "Normal", "Overweight", "Obesity", "Your BMI"],
      datasets: [
        {
          label: "BMI",
          data: [18.5, 25, 30, 40, bmi],
          backgroundColor: [
            "#ef4444",
            "#22c55e",
            "#f97316",
            "#dc2626",
            "#0d9488",
          ],
          borderColor: ["#b91c1c", "#15803d", "#c2410c", "#b91c1c", "#0f766e"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
          title: { display: true, text: "BMI" },
        },
        x: { title: { display: true, text: "Category" } },
      },
    },
  });
}

function clearBMI() {
  document.getElementById("bmiUnits").value = "metric";
  document.getElementById("bmiWeight").value = "70";
  document.getElementById("bmiHeight").value = "175";
  document.getElementById("bmiWeightError").style.display = "none";
  document.getElementById("bmiHeightError").style.display = "none";
  document.getElementById("bmiResult").innerHTML = "";
  document.getElementById("bmiSuggestions").style.display = "none";
  document.getElementById("bmiChart").style.display = "none";
  if (bmiChartInstance) bmiChartInstance.destroy();
  convertBMIUnits();
}

function calcBMR() {
  const sex = document.getElementById("bmrSex").value;
  const age = parseInt(document.getElementById("bmrAge").value);
  const weight = parseFloat(document.getElementById("bmrWeight").value);
  const height = parseFloat(document.getElementById("bmrHeight").value);
  const activity = parseFloat(document.getElementById("bmrActivity").value);
  const ageError = document.getElementById("bmrAgeError");
  const weightError = document.getElementById("bmrWeightError");
  const heightError = document.getElementById("bmrHeightError");
  const resultDiv = document.getElementById("bmrResult");
  const suggestionsDiv = document.getElementById("bmrSuggestions");

  ageError.style.display = "none";
  weightError.style.display = "none";
  heightError.style.display = "none";
  resultDiv.innerHTML = "";
  suggestionsDiv.style.display = "none";
  if (bmrChartInstance) bmrChartInstance.destroy();

  if (!age || age < 1 || age > 120) {
    ageError.style.display = "block";
    return;
  }
  if (!weight || weight < 0.5 || weight > 500) {
    weightError.style.display = "block";
    return;
  }
  if (!height || height < 30 || height > 300) {
    heightError.style.display = "block";
    return;
  }

  let bmr;
  if (sex === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  const tdee = Math.round(bmr * activity);
  bmr = Math.round(bmr);

  let suggestions = `
    <h3><i class="bi bi-lightbulb"></i> Suggestions</h3>
    <ul>
      <li>Maintain: Consume around ${tdee} kcal/day.</li>
      <li>Weight loss: Reduce by 500–1000 kcal/day for 0.5–1 kg/week loss.</li>
      <li>Weight gain: Increase by 500–1000 kcal/day for 0.5–1 kg/week gain.</li>
      <li>Focus on balanced meals with proteins, carbs, and healthy fats.</li>
    </ul>`;

  resultDiv.innerHTML = `Your BMR is <strong>${bmr}</strong> kcal/day. Your TDEE is <strong>${tdee}</strong> kcal/day.`;
  suggestionsDiv.innerHTML = suggestions;
  suggestionsDiv.style.display = "block";

  const ctx = document.getElementById("bmrChart").getContext("2d");
  document.getElementById("bmrChart").style.display = "block";
  bmrChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["BMR", "TDEE", "Weight Loss", "Weight Gain"],
      datasets: [
        {
          label: "Calories (kcal)",
          data: [bmr, tdee, tdee - 500, tdee + 500],
          backgroundColor: ["#0d9488", "#f97316", "#ef4444", "#22c55e"],
          borderColor: ["#0f766e", "#c2410c", "#b91c1c", "#15803d"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Calories (kcal)" },
        },
        x: { title: { display: true, text: "Category" } },
      },
    },
  });
}

function clearBMR() {
  document.getElementById("bmrSex").value = "male";
  document.getElementById("bmrAge").value = "30";
  document.getElementById("bmrWeight").value = "70";
  document.getElementById("bmrHeight").value = "175";
  document.getElementById("bmrActivity").value = "1.2";
  document.getElementById("bmrAgeError").style.display = "none";
  document.getElementById("bmrWeightError").style.display = "none";
  document.getElementById("bmrHeightError").style.display = "none";
  document.getElementById("bmrResult").innerHTML = "";
  document.getElementById("bmrSuggestions").style.display = "none";
  document.getElementById("bmrChart").style.display = "none";
  if (bmrChartInstance) bmrChartInstance.destroy();
}

function calcPreg() {
  const lmp = new Date(document.getElementById("lmp").value);
  const cycle = parseInt(document.getElementById("cycle").value);
  const lmpError = document.getElementById("lmpError");
  const cycleError = document.getElementById("cycleError");
  const resultDiv = document.getElementById("pregResult");
  const suggestionsDiv = document.getElementById("pregSuggestions");

  lmpError.style.display = "none";
  cycleError.style.display = "none";
  resultDiv.innerHTML = "";
  suggestionsDiv.style.display = "none";
  if (pregChartInstance) pregChartInstance.destroy();

  if (!lmp || isNaN(lmp.getTime())) {
    lmpError.style.display = "block";
    return;
  }
  if (!cycle || cycle < 20 || cycle > 45) {
    cycleError.style.display = "block";
    return;
  }

  const dueDate = new Date(lmp);
  dueDate.setDate(lmp.getDate() + 280 + (cycle - 28));
  const today = new Date();
  const weeksPregnant = Math.floor((today - lmp) / (7 * 24 * 60 * 60 * 1000));
  const weeksRemaining = 40 - weeksPregnant;

  resultDiv.innerHTML = `Your estimated due date is <strong>${dueDate.toDateString()}</strong>. You are approximately <strong>${weeksPregnant}</strong> weeks pregnant.`;
  suggestionsDiv.innerHTML = `
    <h3><i class="bi bi-lightbulb"></i> Suggestions</h3>
    <ul>
      <li>Consult an obstetrician for regular checkups.</li>
      <li>Maintain a balanced diet rich in folate, iron, and calcium.</li>
      <li>Engage in light exercise like prenatal yoga, if approved by your doctor.</li>
    </ul>`;
  suggestionsDiv.style.display = "block";

  const ctx = document.getElementById("pregChart").getContext("2d");
  document.getElementById("pregChart").style.display = "block";
  pregChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Weeks Pregnant", "Weeks Remaining"],
      datasets: [
        {
          data: [weeksPregnant, weeksRemaining],
          backgroundColor: ["#0d9488", "#f3f4f6"],
          borderColor: ["#0f766e", "#d1d5db"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

function clearPreg() {
  document.getElementById("lmp").value = "";
  document.getElementById("cycle").value = "28";
  document.getElementById("lmpError").style.display = "none";
  document.getElementById("cycleError").style.display = "none";
  document.getElementById("pregResult").innerHTML = "";
  document.getElementById("pregSuggestions").style.display = "none";
  document.getElementById("pregChart").style.display = "none";
  if (pregChartInstance) pregChartInstance.destroy();
}

function calcWater() {
  const weight = parseFloat(document.getElementById("waterWeight").value);
  const exercise = parseInt(document.getElementById("waterExercise").value);
  const weightError = document.getElementById("waterWeightError");
  const exerciseError = document.getElementById("waterExerciseError");
  const resultDiv = document.getElementById("waterResult");
  const suggestionsDiv = document.getElementById("waterSuggestions");

  weightError.style.display = "none";
  exerciseError.style.display = "none";
  resultDiv.innerHTML = "";
  suggestionsDiv.style.display = "none";
  if (waterChartInstance) waterChartInstance.destroy();

  if (!weight || weight < 0.5 || weight > 500) {
    weightError.style.display = "block";
    return;
  }
  if (exercise < 0 || exercise > 1440) {
    exerciseError.style.display = "block";
    return;
  }

  const baseWater = weight * 35;
  const exerciseWater = (exercise / 30) * 350;
  const totalWater = Math.round((baseWater + exerciseWater) / 100) / 10;

  resultDiv.innerHTML = `Your daily water intake should be approximately <strong>${totalWater}</strong> liters.`;
  suggestionsDiv.innerHTML = `
    <h3><i class="bi bi-lightbulb"></i> Suggestions</h3>
    <ul>
      <li>Drink water consistently throughout the day.</li>
      <li>Carry a reusable water bottle for convenience.</li>
      <li>Add fruits like lemon or cucumber for flavor.</li>
    </ul>`;
  suggestionsDiv.style.display = "block";

  const ctx = document.getElementById("waterChart").getContext("2d");
  document.getElementById("waterChart").style.display = "block";
  waterChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Base Water", "Exercise Water", "Total"],
      datasets: [
        {
          label: "Water (liters)",
          data: [baseWater / 1000, exerciseWater / 1000, totalWater],
          backgroundColor: ["#0d9488", "#f97316", "#22c55e"],
          borderColor: ["#0f766e", "#c2410c", "#15803d"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Water (liters)" },
        },
        x: { title: { display: true, text: "Category" } },
      },
    },
  });
}

function clearWater() {
  document.getElementById("waterWeight").value = "70";
  document.getElementById("waterExercise").value = "30";
  document.getElementById("waterWeightError").style.display = "none";
  document.getElementById("waterExerciseError").style.display = "none";
  document.getElementById("waterResult").innerHTML = "";
  document.getElementById("waterSuggestions").style.display = "none";
  document.getElementById("waterChart").style.display = "none";
  if (waterChartInstance) waterChartInstance.destroy();
}

function calcSteps() {
  const steps = parseInt(document.getElementById("stepsCount").value);
  const weight = parseFloat(document.getElementById("stepsWeight").value);
  const stepsError = document.getElementById("stepsCountError");
  const weightError = document.getElementById("stepsWeightError");
  const resultDiv = document.getElementById("stepsResult");
  const suggestionsDiv = document.getElementById("stepsSuggestions");

  stepsError.style.display = "none";
  weightError.style.display = "none";
  resultDiv.innerHTML = "";
  suggestionsDiv.style.display = "none";
  if (stepsChartInstance) stepsChartInstance.destroy();

  if (!steps || steps < 1 || steps > 100000) {
    stepsError.style.display = "block";
    return;
  }
  if (!weight || weight < 0.5 || weight > 500) {
    weightError.style.display = "block";
    return;
  }

  const met = 3.5; // MET for walking at moderate pace
  const calories = Math.round((steps / 2000) * met * weight * 0.57);

  resultDiv.innerHTML = `You burned approximately <strong>${calories}</strong> kcal from <strong>${steps}</strong> steps.`;
  suggestionsDiv.innerHTML = `
    <h3><i class="bi bi-lightbulb"></i> Suggestions</h3>
    <ul>
      <li>Aim for 10,000 steps daily for general health.</li>
      <li>Incorporate brisk walking or stair climbing for higher calorie burn.</li>
      <li>Use a pedometer or fitness tracker for accuracy.</li>
    </ul>`;
  suggestionsDiv.style.display = "block";

  const ctx = document.getElementById("stepsChart").getContext("2d");
  document.getElementById("stepsChart").style.display = "block";
  stepsChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Your Steps", "Daily Goal (10,000)"],
      datasets: [
        {
          label: "Calories (kcal)",
          data: [calories, (10000 / 2000) * met * weight * 0.57],
          backgroundColor: ["#0d9488", "#f3f4f6"],
          borderColor: ["#0f766e", "#d1d5db"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Calories (kcal)" },
        },
        x: { title: { display: true, text: "Steps" } },
      },
    },
  });
}

function clearSteps() {
  document.getElementById("stepsCount").value = "5000";
  document.getElementById("stepsWeight").value = "70";
  document.getElementById("stepsCountError").style.display = "none";
  document.getElementById("stepsWeightError").style.display = "none";
  document.getElementById("stepsResult").innerHTML = "";
  document.getElementById("stepsSuggestions").style.display = "none";
  document.getElementById("stepsChart").style.display = "none";
  if (stepsChartInstance) stepsChartInstance.destroy();
}
