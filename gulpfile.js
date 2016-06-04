
var gulp = require('gulp');
var prompt = require('gulp-prompt');
var yargs = require('yargs');
var replace = require('gulp-replace');
var rename = require('gulp-rename');

gulp.task("create", function () {

    var argv = yargs.argv;

    var type = argv.t || argv.type;
    var name = argv.n || argv.name;
    var less = '{less}';
    var scss = 'SCSS';

    if (type && name) { // Use command line arguments
        crateLayout(type, name);
    }
    else { // Ask the user for data
        return gulp.src("*")
            .pipe(prompt.prompt({
                type: 'checkbox',
                name: 'LayoutType',
                message: 'select one',
                choices: [less, scss],
                validate: function (LayoutType) {
                    return !(LayoutType[0] !== less && LayoutType[0] !== scss);
                }
            }, function (lType) {
                gulp.src("*")
                    .pipe(prompt.prompt({
                        type: 'input',
                        name: 'prefix',
                        message: 'Enter prefix',
                    }, function (lPrefix) {
                        createLayout(lType.LayoutType[0], lPrefix.prefix);
                    }));
            }));
    }

    function createLayout(type, prefix) {

        var configs = getConfigs(type);
        gulp.src('templates/layout.txt')
            .pipe(replace('##CompName##', prefix))
            .pipe(replace("##MIX##", configs.mix))
            .pipe(replace('##VAR##', configs.variable))
            .pipe(replace('##EXTEND##', configs.extend))
            .pipe(replace('##INCLUDE##', configs.include))
            .pipe(rename(prefix + '-layout' + configs.suffix))
            .pipe(gulp.dest('./target/'));
    }

    function getConfigs(type) {

        if (type === less) {
            return {
                suffix: '.less',
                mix: '.',
                variable: '@',
                extend: '',
                include: '.'
            }
        }
        return {
            suffix: '.scss',
            mix: '@mixin ',
            variable: '$',
            extend: '@extend',
            include: '@include '
        }
    }
}
);






