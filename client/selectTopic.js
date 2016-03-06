/**
 * Created by Dan on 3/5/2016.
 */
Template['selectTopic'].helpers({
    record: function() {
        return Topics.find();
    }
});
Template.selectTopic.onRendered(function() {
    $('select').material_select();
});