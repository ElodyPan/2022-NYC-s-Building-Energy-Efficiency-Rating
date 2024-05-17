# NYC's Building Energy Efficiency Rating

## Motivation
My interest in this project stems from a commitment to promoting sustainable building practices. By making energy efficiency data accessible and understandable, I hope to encourage building owners and tenants to invest in energy-saving measures. This project not only aids academic learning but also contributes to environmental sustainability by highlighting areas for energy efficiency improvements.

## Project Overview
This project focuses on visualizing the energy efficiency ratings of buildings across New York City for the year 2022. The aim is to provide a user-friendly web map that allows users to see energy efficiency data at a glance, offering insights into where improvements can be made.

## About the Data
The data used in this project is sourced from the NYC Building Energy and Water Data Disclosure for Local Law 84 (https://data.cityofnewyork.us/Environment/NYC-Building-Energy-and-Water-Data-Disclosure-for-/5zyy-y8am/about_data). This dataset includes energy and water consumption data for large buildings in New York City, providing a comprehensive overview of their efficiency ratings.

## How to Use the Map
- Users can navigate to each part of detailed information about NYC building efficiency rating through the web map.
- By clicking on the building markers, users can view detailed information about the specific buildings, including address, gross square footage, Energy Star score, and greenhouse gas emissions.
- Additionally, users can fly to each borough using the provided buttons, which will zoom in on the selected borough and display relevant buildings

## Potential Issues
Borough boundaries may not be shown if you are using the file:// protocol due to CORS policy restrictions. To resolve this, start a local server (e.g., using Python with python -m http.server 8000) and access the project through http://localhost:8000 in your web browser. This approach should resolve any CORS issues.

## Potential Usage
This map can be a valuable tool for city planners, policymakers, environmentalists, and building owners who are interested in understanding and improving building energy efficiency. By identifying buildings with lower efficiency ratings, targeted interventions and investments can be made to enhance sustainability and reduce carbon emissions in New York City.
