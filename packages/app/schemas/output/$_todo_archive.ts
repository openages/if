export default {
      "TodoArchive.Item": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "todo"
                  },
                  "status": {
                        "type": "string",
                        "enum": [
                              "checked",
                              "unchecked",
                              "closed"
                        ]
                  },
                  "star": {
                        "type": "number"
                  },
                  "archive_time": {
                        "type": "number"
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle": {
                        "type": "object",
                        "properties": {
                              "enabled": {
                                    "type": "boolean"
                              },
                              "value": {
                                    "type": "array",
                                    "items": {
                                          "type": "number"
                                    }
                              }
                        },
                        "required": [
                              "enabled",
                              "value"
                        ]
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object"
                        }
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "create_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "create_at",
                  "id",
                  "status",
                  "text",
                  "type"
            ]
      },
      "Todo.Todo": {
            "type": "object",
            "properties": {
                  "type": {
                        "type": "string",
                        "const": "todo"
                  },
                  "status": {
                        "type": "string",
                        "enum": [
                              "checked",
                              "unchecked",
                              "closed"
                        ]
                  },
                  "star": {
                        "type": "number"
                  },
                  "archive_time": {
                        "type": "number"
                  },
                  "tag_ids": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
                  },
                  "circle": {
                        "type": "object",
                        "properties": {
                              "enabled": {
                                    "type": "boolean"
                              },
                              "value": {
                                    "type": "array",
                                    "items": {
                                          "type": "number"
                                    }
                              }
                        },
                        "required": [
                              "enabled",
                              "value"
                        ]
                  },
                  "children": {
                        "type": "array",
                        "items": {
                              "type": "object"
                        }
                  },
                  "id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "text": {
                        "type": "string"
                  },
                  "angle_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "create_at": {
                        "type": "number"
                  }
            },
            "required": [
                  "angle_id",
                  "create_at",
                  "id",
                  "status",
                  "text",
                  "type"
            ]
      }
} as const