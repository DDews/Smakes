/**
 * Created by Dan on 3/5/2016.
 */
Template['search'].helpers({
    record: function() {
        return Topics.find();
    }
});