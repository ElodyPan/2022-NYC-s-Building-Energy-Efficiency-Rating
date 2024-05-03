# NYC's Building Energy Efficiency Rating

## Motivation
My interest in this project stems from a commitment to promoting sustainable building practices. By making energy efficiency data accessible and understandable, I hope to encourage building owners and tenants to invest in energy-saving measures. This project not only helps in academic learning but also contributes to environmental sustainability by highlighting areas for energy efficiency improvements.

## Project Overview
This project is part of an ongoing effort for the NYU Web Mapping class, focusing on visualizing the energy efficiency ratings of buildings across New York City. The aim is to provide a user-friendly web map that allows users to see energy efficiency data at a glance, offering insights into where improvements can be made.

## Current Status
- **Current Version**: Displays 27 buildings.
- **Accuracy**: Some positions of BBL (Borough Block Lot) may be incorrect due to data conversion challenges.
- **Data Processing**: Data is being converted from PDFs to Excel sheets, then to JSON format. Additionally, there is an ongoing effort to convert BBL data to accurate geographic coordinates (longitude and latitude) or possibly to upgrade to building zone-specific data.

## Challenges Faced
- **Geo-Referencing Building Data**: One of the significant hurdles I'm currently facing is mapping the BBL (Borough Block and Lot) identifiers to their corresponding geographic coordinates (latitude and longitude). While I have obtained the building data for the years 2019 to 2020 in CSV format, the integration of this data with geospatial maps has been challenging. The BBL identifiers need to be accurately converted to geo-coordinates to visualize the data on a map effectively.
- **Data Acquisition via APIs**: I am exploring various APIs to supplement the existing data with more detailed information. This involves determining the most effective and efficient API options for extracting data related to specific buildings or lots.



## Future Goals
- **Utilizing Geocoding APIs**: To resolve the issue with geo-referencing, I plan to use geocoding APIs that can convert BBL into latitude and longitude. APIs such as the NYC Geoclient API or commonly used services like Google Maps Geocoding API are potential options. This will allow for accurate placement of buildings on the map.
- **Data Expansion and Trend Analysis**: Moving forward, I intend to expand the dataset beyond the current years and include a broader range of data sorted by year. This will enable us to analyze trends in building energy efficiency over time, providing valuable insights into progress and areas that require more attention.

