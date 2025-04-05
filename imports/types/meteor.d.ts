import 'meteor/meteor';

declare module "meteor/meteor" {
    namespace Meteor {
        interface UserProfile {
            name: string;
        }
    }
}