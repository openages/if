export default {
      "Schedule.Setting": {
            "type": "object",
            "properties": {
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
                  "type": {
                        "type": "string",
                        "enum": [
                              "calendar",
                              "timeline",
                              "fixed"
                        ]
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
                  },
                  "fixed_scale": {
                        "type": "string",
                        "enum": [
                              "day",
                              "week",
                              "month",
                              "year"
                        ],
                        "maxLength": 6
                  },
                  "in_timeline_year": {
                        "type": "boolean"
                  }
            },
            "required": [
                  "id",
                  "file_id",
                  "type",
                  "tag",
                  "text",
                  "todos",
                  "start_time",
                  "end_time"
            ]
      },
      "Schedule.CalendarItem": {
            "type": "object",
            "properties": {
                  "start": {
                        "type": "number"
                  },
                  "length": {
                        "type": "number"
                  },
                  "past": {
                        "type": "boolean"
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "type": {
                        "type": "string",
                        "enum": [
                              "calendar",
                              "timeline",
                              "fixed"
                        ]
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
                  },
                  "fixed_scale": {
                        "type": "string",
                        "enum": [
                              "day",
                              "week",
                              "month",
                              "year"
                        ],
                        "maxLength": 6
                  },
                  "in_timeline_year": {
                        "type": "boolean"
                  }
            },
            "required": [
                  "end_time",
                  "file_id",
                  "id",
                  "length",
                  "past",
                  "start",
                  "start_time",
                  "tag",
                  "text",
                  "todos",
                  "type"
            ]
      },
      "Schedule.CalendarDay": {
            "type": "array",
            "items": {
                  "type": "object",
                  "properties": {
                        "start": {
                              "type": "number"
                        },
                        "length": {
                              "type": "number"
                        },
                        "past": {
                              "type": "boolean"
                        },
                        "id": {
                              "type": "string",
                              "maxLength": 30
                        },
                        "file_id": {
                              "type": "string",
                              "maxLength": 30
                        },
                        "type": {
                              "type": "string",
                              "enum": [
                                    "calendar",
                                    "timeline",
                                    "fixed"
                              ]
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
                        },
                        "fixed_scale": {
                              "type": "string",
                              "enum": [
                                    "day",
                                    "week",
                                    "month",
                                    "year"
                              ],
                              "maxLength": 6
                        },
                        "in_timeline_year": {
                              "type": "boolean"
                        }
                  },
                  "required": [
                        "end_time",
                        "file_id",
                        "id",
                        "length",
                        "past",
                        "start",
                        "start_time",
                        "tag",
                        "text",
                        "todos",
                        "type"
                  ]
            }
      },
      "Schedule.CalendarDays": {
            "type": "array",
            "items": {
                  "type": "array",
                  "items": {
                        "type": "object",
                        "properties": {
                              "start": {
                                    "type": "number"
                              },
                              "length": {
                                    "type": "number"
                              },
                              "past": {
                                    "type": "boolean"
                              },
                              "id": {
                                    "type": "string",
                                    "maxLength": 30
                              },
                              "file_id": {
                                    "type": "string",
                                    "maxLength": 30
                              },
                              "type": {
                                    "type": "string",
                                    "enum": [
                                          "calendar",
                                          "timeline",
                                          "fixed"
                                    ]
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
                              },
                              "fixed_scale": {
                                    "type": "string",
                                    "enum": [
                                          "day",
                                          "week",
                                          "month",
                                          "year"
                                    ],
                                    "maxLength": 6
                              },
                              "in_timeline_year": {
                                    "type": "boolean"
                              }
                        },
                        "required": [
                              "end_time",
                              "file_id",
                              "id",
                              "length",
                              "past",
                              "start",
                              "start_time",
                              "tag",
                              "text",
                              "todos",
                              "type"
                        ]
                  }
            }
      }
} as const