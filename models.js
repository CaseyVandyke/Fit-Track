const uuid = require('uuid');

const Routines = {
        create: function (cycle, workout, sets, reps, author, publishDate) {
            const post = {
                id: uuid.v4(),
                cycle: cycle,
                workout: workout,
                sets: sets,
                reps: reps,
                author: author,
                publishDate: publishDate || Date.now()
            };
            this.posts.push(post);
            return post;
        },
        get: function(id=null) {
            if(id !== null) {
                return this.posts.find(post => post.id === id);
            }

            return this.posts.sort(function(a, b) {
                return b.publishDate - a.publishDate
            });
        }
    };

    function createWorkout() {
        const storage = Object.create(Routines);
        storage.posts = [];
        return storage;
      }

      module.exports = {Routines: createWorkout()};
