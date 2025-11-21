export interface EmailTemplate {
  key: string;
  subject: string;
  html: string;
  text: string;
  variables: string[]; // expected placeholders to populate
}

export const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  welcome: {
    key: 'welcome',
    subject: 'Welcome to Clubs, {{name}}! 🎉',
    html: `
      <h1>Welcome, {{name}}!</h1>
      <p>Your account has been created.</p>
      <p>Start by exploring clubs like <strong>{{exampleClub}}</strong>.</p>
    `,
    text: 'Welcome, {{name}}! Your account is ready. Try {{exampleClub}}.',
    variables: ['name', 'exampleClub'],
  },
  'club-invite': {
    key: 'club-invite',
    subject: "You've been invited to {{clubName}}",
    html: `
      <h2>Invitation to {{clubName}}</h2>
      <p>Hi {{name}}, you have been invited to join {{clubName}}.</p>
      <p>Invited by: {{inviterName}}</p>
      <p><a href="{{acceptUrl}}">Accept invitation</a></p>
    `,
    text: 'Hi {{name}}, invitation to {{clubName}} by {{inviterName}}. Accept: {{acceptUrl}}',
    variables: ['name', 'clubName', 'inviterName', 'acceptUrl'],
  },
  'event-reminder': {
    key: 'event-reminder',
    subject: 'Reminder: {{eventName}} on {{eventDate}}',
    html: `
      <h2>Event Reminder</h2>
      <p>{{eventName}} is happening on {{eventDate}} at {{eventTime}}.</p>
      <p>Location: {{location}}</p>
      <p><a href="{{detailsUrl}}">View details</a></p>
    `,
    text: '{{eventName}} on {{eventDate}} {{eventTime}} at {{location}}. Details: {{detailsUrl}}',
    variables: [
      'eventName',
      'eventDate',
      'eventTime',
      'location',
      'detailsUrl',
    ],
  },
  'unsubscribe-confirmation': {
    key: 'unsubscribe-confirmation',
    subject: 'You have been unsubscribed',
    html: `
      <h2>Unsubscribed</h2>
      <p>Hi {{name}}, you have been unsubscribed from {{scope}} notifications.</p>
      <p>You can re-subscribe anytime in your settings.</p>
    `,
    text: 'Hi {{name}}, you are unsubscribed from {{scope}} notifications.',
    variables: ['name', 'scope'],
  },
  'event-update': {
    key: 'event-update',
    subject: 'Event details has been updated',
    html: `
      <h2>Update</h2>
      <p>Hi {{name}}, an event has been updated.</p>
      <p>You can re-subscribe anytime in your settings.</p>
    `,
    text: 'Hi {{name}}, an event has been updated.',
    variables: ['name', 'scope'],
  },
};
