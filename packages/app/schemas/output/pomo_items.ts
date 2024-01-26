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
                  "flow_mode": {
                        "type": "boolean"
                  }
            },
            "required": [
                  "id",
                  "title",
                  "work_time",
                  "break_time",
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
                                    "flow_mode": {
                                          "type": "boolean"
                                    }
                              },
                              "required": [
                                    "id",
                                    "title",
                                    "work_time",
                                    "break_time",
                                    "flow_mode"
                              ]
                        }
                  },
                  "index": {
                        "type": "number"
                  },
                  "status": {
                        "type": "string",
                        "enum": [
                              "work",
                              "break",
                              null
                        ]
                  },
                  "work_in": {
                        "type": "number"
                  },
                  "break_in": {
                        "type": "number"
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
                  "index",
                  "status",
                  "work_in",
                  "break_in",
                  "continuous_mode",
                  "create_at"
            ]
      }
} as const