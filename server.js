const express = require("express");
const axios = require("axios");
const { parseRule, evaluateCondition } = require("./utils");
require("dotenv").config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});

// Define route to handle weather conditions\
app.get("/weather-conditions", async (req, res) => {
  try {
    // Extract query parameters
    const { location, rule, operator } = req.query;

    if (!rule) {
      res.send(404).json({
        error: `Incorrect params , check  Each of the Folowing:\nrule: ${rule}\noperator: ${operator}`,
      });
    }

    // Parse and validate the rule
    const parsedRule = parseRule(rule);
    if (!parsedRule) {
      return res.status(400).json({ error: "Invalid rule format" });
    }
    const response = await axios.get(
      `${
        process.env.TOMORROW_IO_API_BASE_URL
      }?location=${location}&fields=${parsedRule.filed.join(
        ","
      )}&${operator.toLowerCase()}=${rule}`,
      {
        headers: {
          apikey: process.env.TOMORROW_IO_API_KEY,
        },
        params: {
          startTime: "now", // Optionally specify the start time
          endTime: "nowPlus72h", // Optionally specify the end time,
          units: "metric",
          timesteps: ["1h"],
        },
      }
    );
    let currentInterval = {
      startTime: null,
      endTime: null,
      condition_met: false,
    };
    const timeline = [];
    const intervals = response.data.data.timelines[0].intervals;
    const endTime = response.data.data.timelines[0].endTime;
    const startTime = response.data.data.timelines[0].startTime;

    for (const interval of intervals) {
      const condition_met = evaluateCondition(interval.values, rule, operator);
      currentInterval.startTime = startTime;
      currentInterval.endTime = endTime;
      currentInterval.condition_met = condition_met;
      timeline.push(currentInterval);
    }
    res.status(200).send(timeline);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
