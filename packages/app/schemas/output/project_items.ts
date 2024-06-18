export default {
      "Project.User": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string"
                  },
                  "name": {
                        "type": "string"
                  }
            },
            "required": [
                  "id",
                  "name"
            ]
      },
      "Project.File": {
            "type": "object",
            "properties": {
                  "id": {
                        "type": "string"
                  },
                  "permission": {
                        "type": "object",
                        "additionalProperties": {
                              "type": "string",
                              "enum": [
                                    "read",
                                    "write"
                              ]
                        }
                  }
            },
            "required": [
                  "id",
                  "permission"
            ]
      },
      "Project.Item": {
            "type": "object",
            "properties": {
                  "file_id": {
                        "type": "string",
                        "maxLength": 30
                  },
                  "server": {
                        "type": "string"
                  },
                  "files": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string"
                                    },
                                    "permission": {
                                          "type": "object",
                                          "additionalProperties": {
                                                "type": "string",
                                                "enum": [
                                                      "read",
                                                      "write"
                                                ]
                                          }
                                    }
                              },
                              "required": [
                                    "id",
                                    "permission"
                              ]
                        }
                  },
                  "users": {
                        "type": "array",
                        "items": {
                              "type": "object",
                              "properties": {
                                    "id": {
                                          "type": "string"
                                    },
                                    "name": {
                                          "type": "string"
                                    }
                              },
                              "required": [
                                    "id",
                                    "name"
                              ]
                        }
                  },
                  "pages": {
                        "type": "array",
                        "items": {
                              "type": "string"
                        }
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
                  "server",
                  "files",
                  "users",
                  "pages",
                  "create_at"
            ]
      }
} as const