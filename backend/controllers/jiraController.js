const axios = require("axios");

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

exports.getIssues = async (req, res) => {
  try {
    const response = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/search?jql=ORDER BY created DESC`,
      {
        auth: {
          username: JIRA_EMAIL,
          password: JIRA_API_TOKEN,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    res.json(response.data.issues);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: "Unable to fetch Jira issues",
    });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { summary, description, projectKey } = req.body;

    const response = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
      {
        fields: {
          project: {
            key: projectKey,
          },
          summary,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: description,
                  },
                ],
              },
            ],
          },
          issuetype: {
            name: "Task",
          },
        },
      },
      {
        auth: {
          username: JIRA_EMAIL,
          password: JIRA_API_TOKEN,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: "Unable to create Jira issue",
    });
  }
};
