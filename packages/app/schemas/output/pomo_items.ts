export default {
      "Pomo.Session": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string"
                  },
                  "title": {
                        "type": "string"
                  },
                  "work_time": {
                        "type": "number"
                  },
                  "break_time": {
                        "type": "number"
                  },
                  "done": {
                        "type": "boolean"
                  },
                  "flow_mode": {
                        "type": "boolean"
                  }
            },
            "required": [
                  "id",
                  "title",
                  "work_time",
                  "break_time",
                  "done",
                  "flow_mode"
            ]
      },
      "Pomo.Item": {
            "type": "object",
            "properties": {
                  "file_id": {
                        "type": "string",
                        "maxLength": 120
                  },
                  "sessions": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string"
                                    },
                                    "title": {
                                          "type": "string"
                                    },
                                    "work_time": {
                                          "type": "number"
                                    },
                                    "break_time": {
                                          "type": "number"
                                    },
                                    "done": {
                                          "type": "boolean"
                                    },
                                    "flow_mode": {
                                          "type": "boolean"
                                    }
                              },
                              "required": [
                                    "id",
                                    "title",
                                    "work_time",
                                    "break_time",
                                    "done",
                                    "flow_mode"
                              ]
                        }
                  },
                  "continuous_mode": {
                        "type": "boolean"
                  },
                  "create_at": {
                        "type": "number"
                  },
                  "update_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "file_id",
                  "sessions",
                  "continuous_mode",
                  "create_at"
            ]
      }
} as const