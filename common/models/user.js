// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var config = require('../../server/config.json');
var path = require('path');
var senderAddress = "noreply@loopback.com"; //Replace this address with your actual address

module.exports = function(User) {
  //send verification email after registration
  User.afterRemote('create', function(context, user, next) {
    console.log("Send verification email after registration");
    //console.log(context);
    console.log(user);

    var options = {
      type: 'email',
      to: user.email,
      from: senderAddress,
      subject: 'Gracias por registrarse a Vocero Escolar.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      //redirect: '/verified',
      redirect: 'http://localhost:4200/user-first-time/' + user.email,
      user: user
    };

    user.verify(options, function(err, response) {
      console.log("This is verify method calling");
      if (err) {
        User.deleteById(user.id);
        return next(err);
      }
      context.res.render('response', {
        title: 'Registrado exitosamente',
        content: 'Porfavor revise su bandeja de correo electronico y abra el enlance de bienvenida ' +
            'antes de iniciar sesión.',
        redirectTo: '/',
        redirectToLinkText: 'Iniciar Sesión'
      });
    });
  });

  // Method to render
  User.afterRemote('prototype.verify', function(context, user, next) {
    context.res.render('response', {
      title: 'A Link to reverify your identity has been sent '+
        'to your email successfully',
      content: 'Please check your email and click on the verification link '+
        'before logging in',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });

  //send password reset link when requested
  User.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
        info.accessToken.id + '">here</a> to reset your password';

    User.app.models.Email.send({
      to: info.email,
      from: senderAddress,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

  //render UI page after password change
  User.afterRemote('changePassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password changed successfully',
      content: 'Please login again with new password',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });

  //render UI page after password reset
  User.afterRemote('setPassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password reset success',
      content: 'Your password has been reset successfully',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    });
  });
};
