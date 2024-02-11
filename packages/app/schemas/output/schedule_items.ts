export default {
      "Schedule.Setting": {
            "type": "object",
            "properties": {
                  "mode": {
                        "type": "string",
                        "enum": [
                              "timeline",
                              "fixed"
                        ]
                  },
                  "tags": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string"
                                    },
                                    "color": {
                                          "type": "string"
                                    },
                                    "text": {
                                          "type": "string"
                                    }
                              },
                              "required": [
                                    "id",
                                    "color",
                                    "text"
                              ]
                        }
                  }
            },
            "required": [
                  "mode",
                  "tags"
            ]
      },
      "Tag": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string"
                  },
                  "color": {
                        "type": "string"
                  },
                  "text": {
                        "type": "string"
                  }
            },
            "required": [
                  "id",
                  "color",
                  "text"
            ]
      },
      "Schedule.ScheduleSetting": {
            "type": "object",
            "properties": {
                  "file_id": {
                        "type": "string"
                  },
                  "module": {
                        "type": "string"
                  },
                  "setting": {
                        "type": "object",
                        "properties": {
                              "mode": {
                                    "type": "string",
                                    "enum": [
                                          "timeline",
                                          "fixed"
                                    ]
                              },
                              "tags": {
                                    "type": "array",
                                    "items": {
                                          "type": "object",
                                          "properties": {
                                                "id": {
                                                      "type": "string"
                                                },
                                                "color": {
                                                      "type": "string"
                                                },
                                                "text": {
                                                      "type": "string"
                                                }
                                          },
                                          "required": [
                                                "id",
                                                "color",
                                                "text"
                                          ]
                                    }
                              }
                        },
                        "required": [
                              "mode",
                              "tags"
                        ]
                  }
            },
            "required": [
                  "file_id",
                  "module",
                  "setting"
            ]
      },
      "Schedule.Item": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "tag": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "todos": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "start_time": {
                        "type": "number",
                        "multipleOf": 1,
                        "minimum": 1,
                        "maximum": 9007199254740991
                  },
                  "end_time": {
                        "type": "number",
                        "multipleOf": 1,
                        "minimum": 1,
                        "maximum": 9007199254740991
                  }
            },
            "required": [
                  "id",
                  "file_id",
                  "tag",
                  "text",
                  "todos",
                  "start_time",
                  "end_time"
            ]
      }
} as const