# Trip For Me - Kaggle Writeup

## Title
Trip For Me: The Autonomous AI Travel Agent

## Subtitle
Plan complex multimodal trips, budgets, and itineraries in seconds using Gemini.

## Track
Gemini API / Web Application

## Thumbnail
*(Insert a screenshot of the landing page or the result view here)*

## Project Description
**Trip For Me** is an autonomous travel planning engine designed to eliminate the stress of organizing a vacation. Instead of browsing dozens of tabs for flights, hotels, and things to do, users simply define their vibe, budget, and destination to get a comprehensive plan instantly.

Built using **React** and the **Google GenAI SDK**, the app leverages **Gemini 2.5 Flash**'s superior JSON handling capabilities. We utilize a complex structured schema to force the model to output distinct arrays for flights, hotels, transit options, and day-by-day itineraries simultaneously. The AI reasons through travel logistics, ensuring the proposed flights match the user's timeline and the budget breakdown is realistic for the destination.

This project democratizes access to personalized travel planning. By providing instant, actionable itineraries with booking links and visualization tools like budget charts, "Trip For Me" empowers users to explore the world with confidence, saving them hours of research time.

## Video Demo
[Link to Video Demo] *(Replace with your YouTube/Loom link)*

---

## 1.5 Minute Video Script

**[0:00 - 0:15] The Problem & Hook**
*(Visual: Split screen. Left side shows a screen cluttered with 20 open browser tabs (Expedia, Maps, blogs). Right side shows the clean, calm 'Trip For Me' landing page.)*
**Voiceover:** "Planning a trip shouldn't feel like a full-time job. Between coordinating flights, finding decent hotels, and building an itinerary, the joy of travel often gets lost in the logistics. Meet 'Trip For Me'—your autonomous AI travel agent."

**[0:15 - 0:45] The Demo: Input & Generation**
*(Visual: Screen recording of the app. Cursor clicks 'AI Planner'. User selects 'Nature' and 'Adventure' tags. User types 'Kyoto, Japan' into the destination and 'San Francisco' as origin. Clicks the 'Search' button. Show the loading animation with the 'Analyzing Routes' text.)*
**Voiceover:** "Built on the power of Gemini, Trip For Me understands context. Whether you want a budget-friendly backpacking tour or a luxury getaway, just set your preferences. Unlike basic chatbots, Trip For Me doesn't just chat—it engineers a plan. Watch as it analyzes routes and accommodations in seconds."

**[0:45 - 1:10] The Demo: Results & Visualization**
*(Visual: The results load. Scroll down to show the flight cards with prices. Hover over a Hotel card to show the rating. Click the 'Daily Itinerary' tab to expand Day 1 and Day 2. Finally, click the 'Budget & Costs' tab to reveal the animated Pie Chart.)*
**Voiceover:** "It doesn't just give you text. You get structured, actionable data: real flight options, top-rated hotel suggestions, and a day-by-day itinerary tailored to your pace. Check the 'Finance' tab for a complete breakdown of costs before you even book. It's comprehensive and visual."

**[1:10 - 1:20] The Technology**
*(Visual: A quick flash of the code showing the JSON Schema definition and the Gemini API call.)*
**Voiceover:** "Under the hood, we leverage Gemini's structured output capabilities to generate complex, valid JSON schemas, ensuring every plan is consistent, multimodal, and reliable."

**[1:20 - 1:30] Outro**
*(Visual: User clicks 'Save Plan', then navigates to the 'Profile' page to see the saved trip card. Fade to logo.)*
**Voiceover:** "Stop planning, start exploring. Experience the next generation of travel with Trip For Me."