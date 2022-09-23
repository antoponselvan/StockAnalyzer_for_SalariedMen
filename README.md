# Stock Analyzer for SalaryMan

Picking right stock needs a lot of time for analysis and tracking. People with full time jobs dont have so much time. This app is built to help these salaried-people to pick the right stock that will give a good return over the long run

## 🎢 Introduction and Motivation

This app is built to solve some of the personal pain-points I had during stock selection. Stock selection is part-Science and part-ART. Keeping this in mind, the app is built to enable anlysis of any US-listed stock on 3 key elements:

- Financial Fundamentals:
- Current stock price in relation to its real worth
- Safeguarding factors: Qualitative factors that will help to prevent a huge loss from a stock

As long as all the above factors give a positive indication, it would be very likely safe to continue investing in the stock.

## 💁 User Experience and Features

There are 2 keys pages for user to reference:

- Analysis of a selected stock
- Recommended list of companies that score well under the criteria used.

For the first type, user enters keywords matching either name or ticker-code of company they want to analyze. The app searches thru list of US-listed companies and gives the top hits. Once the user clicks on the stock-name, all data (SEC filings & Stock-price) of that stock is downloaded. This also triggers calculation of key metrics (Eg: CAGR (Compounded Annual growth rate) of Income/Revenue etc). The following information and graphs are presented in following tabs:

- Summary Tab:
  -- Share Price Trend
  -- CAGR () of key indicators like Revenue, Income, DebtByAsset ratio
  -- Trend of P/E, P/B ratio and its 3 yr moving avg
- Financial Fundamentals tab:
  -- Trends of Revenue, Income and Debt/Asset ratio
- Valuation tab:
  -- P/E trend and its moving avg
  -- P/B trend and its moving avg.

## 🎥 Visuals

![User Interface](/img/stockAnalyzer.gif)

## 🏢 Program Architecture

![Architecture](/img/ProgramArchitecture.jpg)

## 🔥Key Challenges

The main challenges involve following:

- Design of program architecture and data flow
- Right way of designing state variable and using react hooks
- Learning a new CSS frame-work(bootstrap) and trying to integrate it

## 💻 Technologies, API & Libraries used

Technologies:

- React JS
- BootStrap
- HTML / CSS

API:

- AlphaVantage
- SEC

JS Libraries:

- Plotly
