# p5-Bug-Squishing-Browser-Game
Fully functional bug squishing game with personally developed sounds and animations and personally drawn sprites!

Graphics Portion (Part 1):
Write a P5 Sketch that implements a simple computer game where you squish bugs (or other creatures) with the mouse.

Begin with several bugs walking around the screen. The user must click the mouse on a bug to squish it. The user must squish as many bugs as possible in 30 seconds.

Keep an on-screen count of the number of bugs squished and an on-screen timer counting down from 30 seconds. The game should get harder as it proceeds, so make the bugs move faster with each squish. After 30 seconds, the game ends.

Recall the Homework 3 animation. It has seven frames. Use your favorite image editing software (Photoshop, Illustrator, Paint, Gimp, Inkscape, ...) to draw an animated bug that walks similarly.

In the case of the bug, there should be an additional image: squished and dead.

Animate the bug so that it faces the direction that it's moving. You can accomplish this by drawing an animation for each direction, or by simply using the rotate or scale function.

It's recommended that you define a class to represent a bug, and use an array of objects to create several bugs.

Note, the player must *click* on a bug to kill it. Do not simply test if the mouse button is pressed while the pointer is on the bug, as this lets the player click once and simply drag around to score squishes. Too easy!

You'll likely have several files for this project (HTML, JS, images, font, etc), so package them all in a ZIP and upload that.

Sound Portion (Part 2):

Make a fun musical theme with your new found sequence, scheduling and looping skills.

Have in-game events trigger sonic events. These could be synthesized, soundfiles, or both. What is the sound of a squished bug? A missed bug? Frenzied bug skittering?

As the game play changes, (increases speed, adds more bugs, nears the end) represent it sonically. How will the music or sound adapt?

Incorporate game states into the sound design. e.g. start page, game over, etc. Adapt your music or interaction sounds accordingly. 
