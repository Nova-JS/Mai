const { Structures, Collection } = require('discord.js');

module.exports = Structures.extend('User', User => {
  class MaiUser extends User {
    constructor(client, data){
      super(client, data);

      this.profile = null;

      this.cooldown = new Collection();
    };

    async loadProfile(){
      if (this.client.database === null || !this.client.database.connected){
        return Promise.reject('Couldn\'t connect to Database');
      };

      const profile = this.client.database['Profile'];
      let document = await profile.findById({ _id: this.id });

      if (!(document instanceof profile)){
        document = await new profile({ _id: this.id }).save().catch(() => {});
        if (!document) return Promise.reject('Error while saving the profile document for ' + this.id);
      };

      this.profile = document;
      return Promise.resolve(this.profile);
    };

    setLanguage(code){
      return this.profile.data.language = code;
    };
  };

  return MaiUser;
});
