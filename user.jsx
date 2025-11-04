{
  "name": "UserProfile",
  "type": "object",
  "properties": {
    "display_name": {
      "type": "string",
      "description": "User's preferred display name"
    },
    "bio": {
      "type": "string",
      "description": "Short bio about the user"
    },
    "age": {
      "type": "number",
      "minimum": 18,
      "maximum": 100
    },
    "location": {
      "type": "string",
      "description": "City or general area"
    },
    "profile_image": {
      "type": "string",
      "description": "Profile photo URL"
    },
    "interests": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of interests and hobbies"
    },
    "vibes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "chill",
          "adventurous",
          "creative",
          "active",
          "intellectual",
          "social",
          "spontaneous",
          "thoughtful"
        ]
      },
      "description": "Personality vibes"
    },
    "preferred_activities": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Activities they enjoy"
    },
    "availability": {
      "type": "string",
      "enum": [
        "weekdays",
        "weekends",
        "evenings",
        "anytime",
        "flexible"
      ],
      "default": "flexible"
    },
    "verified": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "display_name",
    "bio",
    "age",
    "location"
  ],
  "rls": {
    "read": {},
    "write": {
      "created_by": "{{user.email}}"
    }
  }
}
