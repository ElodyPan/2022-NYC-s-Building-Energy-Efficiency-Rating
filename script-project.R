setwd("/Users/ypan/R/my-r-project")

library(tidyverse)
library(janitor)

b2023 <- read.csv(file = "/Users/ypan/R/my-r-project/data/NYC_Building_Energy_and_Water_Data_Disclosure_for_Local_Law_84__2023-Present__20240515.csv") %>% 
  clean_names() 

#cleaning
b2023_clean <- b2023 %>% 
  mutate(energy_star_score = as.numeric(energy_star_score)) 

b2023_rating <- b2023_clean %>% 
  mutate(energy_star_rating = case_when(
    is.na(energy_star_score) ~ "F",
    energy_star_score >= 85 ~ "A",
    energy_star_score >= 70 & energy_star_score < 85 ~ "B",
    energy_star_score >= 55 & energy_star_score < 70 ~ "C",
    energy_star_score < 55 ~ "D",
    TRUE ~ "N"
  )) %>% 
  group_by(energy_star_rating) %>% 
  summarize(count = n(), .groups = 'drop')

##---general performance---##
#plot
energy_star_plot <- ggplot(b2023_rating, aes(x = energy_star_rating, y = count, fill = energy_star_rating)) +
  geom_bar(stat = "identity") +
  theme_minimal() +
  ggtitle("Distribution of Energy Efficiency Grades") +
  xlab("Energy Efficiency Grade") +
  ylab("Count") +
  scale_fill_brewer(palette = "Set2") +
  labs(
    x = "Energy Efficiency Grade",
    y = "Count"
  )

energy_star_plot

ggsave("general performance.png", plot=energy_star_plot, bg = "transparent")

# histogram
energy_star_histogram <- ggplot(b2023_clean, aes(x = energy_star_score)) +
  geom_histogram(aes(y = ..count..), binwidth = 5, fill = "skyblue", color = "black") +
  geom_density(aes(y = ..count.. * 5), color = "blue", size = 1) +  # Adjust the y scale for density
  theme_minimal() +
  ggtitle("Distribution of ENERGY STAR Scores") +
  xlab("ENERGY STAR Score") +
  ylab("Count") +
  labs(
    title = "Distribution of ENERGY STAR Scores",
    x = "ENERGY STAR Score",
    y = "Count"
  )

energy_star_histogram


##---boro performance---##
#by boro
b2023_filtered <- b2023_clean %>%
  filter(!is.na(energy_star_score), !is.na(borough))

# Create a boxplot of ENERGY STAR scores by borough
energy_star_histogram <- ggplot(b2023_filtered, aes(x = energy_star_score, fill = city)) +
  geom_histogram(binwidth = 5, color = "black", alpha = 0.7) +
  facet_wrap(~ city, scales = "free_y") +
  theme_minimal() +
  ggtitle("Distribution of ENERGY STAR Scores by Borough") +
  xlab("ENERGY STAR Score") +
  ylab("Count of Buildings") +
  scale_fill_brewer(palette = "Set2") +
  labs(
    title = "Distribution of ENERGY STAR Scores by Borough",
    x = "ENERGY STAR Score",
    y = "Count of Buildings"
  )

energy_star_histogram


#by type
primary_property_type_self_selected

#by built year
year_built



#merging - adding columns & rows

# merge two data frames by ID and Country
#total <- merge(data frameA,data frameB,by=c("ID","Country"))

#total <- rbind(data frameA, data frameB)



#geocode