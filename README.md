OfflineServer
=============

OfflineServer is a development-only HTTP server in a Chrome app, made on a Chromebook.

OfflineServer is not meant for production use. It is a tool that will allow you
to continue development on typically "online-only" devices such as chromebooks,
even when you're offline.

NOTE: This project is brand spankin' new. That means it doesn't do anything
useful right now. And anything it does do is probably very broken.

## Plans

My intent for this app is to allow engineers to create local "server apps"
in a declarative way using nothing but their browser.

When you open the app you'll be presented with a list of server apps that you've
created and will have the opportunity to manage them and create more. From this
list you'll be able to start and stop your apps so you can connect to them.

If you select an app you'll be shown the set of routes you've created for this
app and will have the opportunity to manage them and create more. Routes are
the combination of an http verb, a path matching string (like /people/:id),
and something to be done when that route matches. Maybe that's a callback
function written in JavaScript in a built-in editor that is evaluated by
HttpServer, maybe it's a JSON or XML string and a content-type dropdown.

## Data

One idea is to have a datastore per app that you can add data to. Then you can
return items from endpoints dynamically that correspond to items in other
endpoints and don't have to hard-code that data. This will help to emulate
an actual server environment.

## Cool tech

* Chrome OS
* Chrome Dev Editor
* IndexedDB
* AngularJS

## Inspiration/Alternatives

* http://deployd.com/
