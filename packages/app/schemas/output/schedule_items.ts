export default {
      "ScheduleItems.Setting": {
            "type": "object",
            "properties": {
                  "type": {
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
                  "type",
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
      "ScheduleItems.ScheduleSetting": {
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
                              "type": {
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
                              "type",
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
      "ScheduleItems.Item": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string"
                  },
                  "file_id": {
                        "type": "string"
                  },
                  "tag": {
                        "type": "string"
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
                        "type": "number"
                  },
                  "end_time": {
                        "type": "number"
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