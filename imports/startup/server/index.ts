import { Meteor } from 'meteor/meteor';
import './register-methods';
import './register-publications';
// import './fixtures';

Meteor.startup(() => {
    console.log('Server Started');
});