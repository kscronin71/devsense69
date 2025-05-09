function calculateFeasibilityScore(cost, sqft, zone, walk, income) {
    let total = 0;
  
    if (cost < 500000) total += 8;
    else if (cost < 1000000) total += 6;
    else total += 4;
  
    if (sqft < 10000) total += 8;
    else if (sqft < 30000) total += 6;
    else total += 4;
  
    if (zone === "commercial") total += 8;
    else if (zone === "residential") total += 6;
    else total += 4;
  
    total += walk;
  
    if (income > 100000) total += 8;
    else if (income > 60000) total += 6;
    else total += 4;
  
    return total;
  }
  
  function handleCalculate() {
    const cost = Number(document.getElementById("costInput").value);
    const sqft = Number(document.getElementById("sqftInput").value);
    const zone = document.getElementById("zoneInput").value;
    const walk = Number(document.getElementById("walkInput").value);
    const income = Number(document.getElementById("incomeInput").value);
  
    const score = calculateFeasibilityScore(cost, sqft, zone, walk, income);
  
    const resultElement = document.getElementById("result");
    const bar = document.getElementById("confidenceBar");
    const emoji = document.getElementById("confidenceEmoji");
    const decisionElement = document.getElementById("decision");
  
    let color, label, icon, decision;
  
    if (score >= 24) {
      color = "green";
      label = "Feasible – Strong Potential";
      icon = "✅";
      decision = "GO";
    } else if (score >= 16) {
      color = "orange";
      label = "Moderate – Needs Review";
      icon = "⚠️";
      decision = "REVIEW";
    } else {
      color = "red";
      label = "Risky – Not Recommended";
      icon = "❌";
      decision = "NO-GO";
    }
  
    resultElement.textContent = `${score}/30 — ${label}`;
    resultElement.style.color = color;
  
    const widthPercent = (score / 30) * 100;
    bar.style.width = `${widthPercent}%`;
    bar.style.backgroundColor = color;
  
    emoji.textContent = icon;
    decisionElement.textContent = decision;
  
    const recElement = document.getElementById("aiRecommendations");
    recElement.innerHTML = "🔄 Generating recommendation...";
  
    getAIRecommendation({ cost, sqft, zone, walk, income, score })
      .then(aiText => {
        recElement.innerHTML = aiText;
      })
      .catch(err => {
        console.error(err);
        recElement.innerHTML = "⚠️ Failed to load AI recommendation.";
      });
  }
  
  async function getAIRecommendation({ cost, sqft, zone, walk, income, score }) {
    const prompt = `Generate a professional development site recommendation based on the following:
  
  - Project Cost: $${cost}
  - Square Footage: ${sqft}
  - Zoning Type: ${zone}
  - Walkability Score: ${walk}
  - Median Income: $${income}
  - Feasibility Score: ${score}/30
  
  The response should be under 100 words, use clear language, and provide actionable insights.`;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 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 // Replace this
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });
  
    const data = await response.json();
    return data.choices[0].message.content;
  }
  