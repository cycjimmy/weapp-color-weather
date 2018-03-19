const gulp = require('gulp');
const cache = require('gulp-cache');
const del = require('del');

// Clear the icon folder
gulp.task('clean:dist', callback => {
  del('dist/');
  return cache.clearAll(callback);
});

