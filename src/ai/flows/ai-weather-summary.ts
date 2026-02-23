'use server';
/**
 * @fileOverview This file implements a Genkit flow that generates an AI-powered summary
 * of current and forecasted weather conditions for a selected location.
 * It uses a tool to identify significant weather events to include in the summary.
 *
 * - aiWeatherSummary - A function that triggers the AI weather summary generation.
 * - AiWeatherSummaryInput - The input type for the aiWeatherSummary function.
 * - AiWeatherSummaryOutput - The return type for the aiWeatherSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema for current weather conditions
const CurrentWeatherSchema = z.object({
  cityName: z.string().describe('The name of the city.'),
  temperature: z.number().describe('Current temperature in Celsius.'),
  feelsLike: z.number().describe('Current perceived temperature in Celsius.'),
  description: z.string().describe('A brief description of current weather conditions.'),
  humidity: z.number().describe('Current humidity percentage.'),
  windSpeed: z.number().describe('Current wind speed in km/h.'),
  uvi: z.number().describe('Current UV Index.'),
  aqi: z.number().describe('Current Air Quality Index.'),
});

// Input Schema for daily forecast
const DailyForecastItemSchema = z.object({
  date: z.string().describe('The date for the forecast (e.g., "Monday").'),
  minTemp: z.number().describe('Minimum temperature for the day in Celsius.'),
  maxTemp: z.number().describe('Maximum temperature for the day in Celsius.'),
  description: z.string().describe('A brief description of the daily weather.'),
  precipitationChance: z.number().describe('Chance of precipitation for the day (0-100%).'),
});

// Input Schema for hourly forecast
const HourlyForecastItemSchema = z.object({
  time: z.string().describe('The time for the forecast (e.g., "10:00 AM").'),
  temperature: z.number().describe('Temperature for the hour in Celsius.'),
  description: z.string().describe('A brief description of the hourly weather.'),
  precipitationChance: z.number().describe('Chance of precipitation for the hour (0-100%).'),
});

// Main Input Schema for the AI weather summary flow
const AiWeatherSummaryInputSchema = z.object({
  currentWeather: CurrentWeatherSchema.describe('Current weather conditions.'),
  dailyForecast: z.array(DailyForecastItemSchema).describe('7-day daily weather forecast.'),
  hourlyForecast: z.array(HourlyForecastItemSchema).describe('24-hour hourly weather forecast.'),
}).describe('Input data containing current weather and forecasts for a location.');

export type AiWeatherSummaryInput = z.infer<typeof AiWeatherSummaryInputSchema>;

// Output Schema for the AI weather summary flow
const AiWeatherSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, AI-generated summary of the current and forecasted weather conditions, highlighting key information and implications.')
});

export type AiWeatherSummaryOutput = z.infer<typeof AiWeatherSummaryOutputSchema>;

// Define a tool to extract significant weather events from the forecast.
const extractSignificantWeatherEvents = ai.defineTool(
  {
    name: 'extractSignificantWeatherEvents',
    description: 'Analyzes weather forecast data to identify and summarize significant weather events or conditions that users should be aware of, such as extreme temperatures, high chance of rain/snow, strong winds, or poor air quality. Returns a list of these events.',
    inputSchema: z.object({
      current: CurrentWeatherSchema.describe('Current weather conditions.'),
      daily: z.array(DailyForecastItemSchema).describe('Daily forecast items.'),
      hourly: z.array(HourlyForecastItemSchema).describe('Hourly forecast items.'),
    }),
    outputSchema: z.array(z.string()).describe('A list of significant weather events or conditions.'),
  },
  async (input) => {
    const significantEvents: string[] = [];
    const { current, daily, hourly } = input;

    // Current conditions
    if (current.temperature > 30) {
      significantEvents.push(`It's currently very hot at ${current.temperature}°C.`);
    } else if (current.temperature < 0) {
      significantEvents.push(`It's currently freezing at ${current.temperature}°C.`);
    }
    if (current.aqi > 100) {
      significantEvents.push(`Air quality is currently poor with an AQI of ${current.aqi}.`);
    }
    if (current.windSpeed > 30) {
        significantEvents.push(`Current wind speeds are high at ${current.windSpeed} km/h.`);
    }

    // Daily forecast analysis
    daily.forEach(day => {
      if (day.maxTemp > 30) {
        significantEvents.push(`${day.date} will be hot with a high of ${day.maxTemp}°C.`);
      }
      if (day.minTemp < 0) {
        significantEvents.push(`${day.date} will be freezing with a low of ${day.minTemp}°C.`);
      }
      if (day.precipitationChance >= 70) {
        significantEvents.push(`High chance of ${day.description.toLowerCase()} (${day.precipitationChance}%) on ${day.date}.`);
      }
    });

    // Hourly forecast analysis
    const next24HoursRain = hourly.filter(hour => hour.precipitationChance >= 60).length;
    if (next24HoursRain > 0) {
        if (next24HoursRain >= 8) {
            significantEvents.push('Expect significant rainfall within the next 24 hours.');
        } else {
            significantEvents.push('There is a chance of rain in the coming hours.');
        }
    }

    return significantEvents;
  }
);

// Define the prompt for generating the weather summary
const aiWeatherSummaryPrompt = ai.definePrompt({
  name: 'aiWeatherSummaryPrompt',
  input: { schema: AiWeatherSummaryInputSchema },
  output: { schema: AiWeatherSummaryOutputSchema },
  tools: [extractSignificantWeatherEvents],
  prompt: `You are an intelligent weather assistant that provides concise, easy-to-understand summaries of weather conditions.
Your goal is to highlight the most relevant and impactful information for the user, drawing implications from the data.
Prioritize safety and comfort-related information.

Use the 'extractSignificantWeatherEvents' tool to identify key events from the forecast data to help you focus your summary.

Current Weather for {{{currentWeather.cityName}}}:
Temperature: {{{currentWeather.temperature}}}°C (Feels like: {{{currentWeather.feelsLike}}}°C)
Conditions: {{{currentWeather.description}}}
Humidity: {{{currentWeather.humidity}}}%
Wind Speed: {{{currentWeather.windSpeed}}} km/h
UV Index: {{{currentWeather.uvi}}}
Air Quality Index (AQI): {{{currentWeather.aqi}}}

7-Day Forecast:
{{#each dailyForecast}}
- {{this.date}}: {{this.minTemp}}°C - {{this.maxTemp}}°C, {{this.description}} ({{this.precipitationChance}}% chance of precipitation)
{{/each}}

Hourly Forecast (Next 24 Hours):
{{#each hourlyForecast}}
- {{this.time}}: {{this.temperature}}°C, {{this.description}} ({{this.precipitationChance}}% chance of precipitation)
{{/each}}

Based on the provided weather data, generate a brief summary (2-3 paragraphs) focusing on the most important current conditions and upcoming changes.
Consider factors like significant temperature shifts, precipitation, wind, and air quality. Advise the user on any necessary precautions or recommended activities.
`,
});

// Define the Genkit flow
const aiWeatherSummaryFlow = ai.defineFlow(
  {
    name: 'aiWeatherSummaryFlow',
    inputSchema: AiWeatherSummaryInputSchema,
    outputSchema: AiWeatherSummaryOutputSchema,
  },
  async (input) => {
    // The prompt will implicitly call the `extractSignificantWeatherEvents` tool if it deems it necessary
    // based on the system prompt and its internal reasoning.
    const { output } = await aiWeatherSummaryPrompt(input);
    return output!;
  }
);

/**
 * Generates an AI-powered summary of the current and forecasted weather conditions
 * for a selected location.
 * @param input - The current and forecasted weather data.
 * @returns A concise, AI-generated summary of the weather.
 */
export async function aiWeatherSummary(input: AiWeatherSummaryInput): Promise<AiWeatherSummaryOutput> {
  return aiWeatherSummaryFlow(input);
}
