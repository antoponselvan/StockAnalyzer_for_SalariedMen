# Stock Analyzer for SalaryMan

Picking right stock needs a lot of time for analysis and tracking. People with full time jobs dont have so much time. This app is built to help these salaried-people to pick the right stock that will give a good return over the long run

## 🎢 Introduction and Motivation

This app is built to solve some of the personal pain-points I had during stock selection. Stock selection is part-Science and part-ART. Keeping this in mind, the app is built to enable anlysis of any US-listed stock on 3 key elements:

- Financial Fundamentals
- Current stock price in relation to its real worth
- Safeguarding factors: Qualitative factors that will help to prevent a huge loss from a stock

As long as all the above factors give a positive indication, it would be very likely safe to continue investing in the stock.

## 💁 User Experience and Features

There are 3 keys pages for user to reference:
- Home page - Explains intent of the app and its key features
- Analysis of a selected stock
- Recommended list of companies that score well under the criteria used.

In the 2nd page, user starts by entering keywords matching either name or ticker-code of company they want to analyze. The app searches thru list of US-listed companies and gives the top hits. Once the user clicks on the stock-name, all data (SEC filings & Stock-price) of that stock is downloaded. This also triggers calculation of key metrics (Eg: CAGR (Compounded Annual growth rate) of Income/Revenue etc). The following information and graphs are presented in following tabs:

- Summary Tab:
  -- Share Price Trend
  -- CAGR (Compounded Annual Growth Rate) of key indicators like Revenue, Income, DebtByAsset ratio
  -- Trend of P/E, P/B ratio and its 3 yr moving avg
- Financial Fundamentals tab:
  -- Trends of Revenue, Income and Debt/Asset ratio
- Valuation tab:
  -- P/E trend and its moving avg
  -- P/B trend and its moving avg

In the 3rd page, a pre-populated list of companies are shown. These are the top 5 companies (amongst biggest 30 US-listed companies) which scored highest based on above criteria. The analysis is carried out outside of the app and the results are filled into a AWS S3 json file. The app reads this JSON file and presents the results to the user

## 🎥 Visuals

![User Interface](/img/stockAnalyzer.gif)

## 🏢 Program Architecture

![Architecture](/img/ProgramArchitectureFigma.jpg)

The core logic of the app is governed by the 4 key variables residing in app.jsx. These key variables are:
- selectedCompany : This is a state variable set by user by clicking a particular company name displayed in search-bar component
- companyData: Change of "selectedCompany" triggers multiple fetch functions to get financial and share-price data of the company. This is stored in "companyData" state variable.
- formattedCompanyData - This is a simple JS variable that store companyData in a format that can be easily plotted. This also contains CAGR and other calculated values to be displayed. This variable is passed down as props to child components
- kpiScore - This JS variable dictates color scheme of different KPI calculated from companyData. This is passed down as props as well 

## 🔥Key Challenges

The main challenges involve following:

- Design of program architecture and data flow
The core questions around designing this program involved identifying which parts should be made components, what should be state variables and where should they reside. It took a while to identify what might be a good way to implement the same.

- Right way of designing state variable and using react hooks
Multiple formats of code can work. However, identifying the best code in terms of performance and maintainability is a challenge. One of the key lessons, I learnt was also how to not over-use useEffect hook and make the program inefficient.

- Learning a new CSS frame-work(bootstrap) and trying to integrate it


## 💻 Technologies, API & Libraries used

Technologies:

- React JS
- BootStrap
- HTML / CSS

API:

- SEC (For all financial data of company)
- AlphaVantage (Only for stock Price of selected company)


JS Libraries:

- Plotly (For graphs)
