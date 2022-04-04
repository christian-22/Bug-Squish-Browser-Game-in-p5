let spritesheet;
let bug = [];
let count = 5;
let startTime;
let gameState = 'wait';
let score = 0;
let numDead = 0;
let baseSpeed = 1;
let maxSpeed = 4;
let hit;

// SYNTH INSTRUMENT
let synth = new Tone.PolySynth().toDestination();

// MAIN MELODY USED FOR 'PLAYING' GAMESTATE
let melodyPlay = new Tone.Sequence((time, note)=>{
    if (note != null)
    {
        synth.triggerAttackRelease(note, 0.05, time);
    }
}, ['G2','A2','B2','C2','F2','D2','F2','C2','B2']);

// MELODY USED FOR 'wait' GAMESTATE (STARTING GAME)
let melodyStart = new Tone.Sequence((time, note)=>{
    if (note != null)
    {
        synth.triggerAttackRelease(note, 0.1, time);
    }
}, ['B4', 'A4']);

// MELODY USED FOR 'end' GAMESTATE (GAME OVER)
let melodyEnd = new Tone.Sequence((time, note)=>{
    if (note != null)
    {
        synth.triggerAttackRelease(note, 0.7, time);
    }
}, ['B4', null, 'A4', null, 'G4', null, 'F4', null, 'E4']);

function preload()
{
    spritesheet = loadImage("media/bugs_full.png");
    hit = new Tone.Player("media/sounds/hit.mp3").toMaster();
}

function setup() 
{
    createCanvas(1000, 600);
    imageMode(CENTER);

    // DEFAULT PLAYBACK RATE
    melodyPlay.playbackRate = 0.75;

    for (let i = 0; i < count; i++)
    {
        bug[i] = new Character(spritesheet, random(200, 500), random(200, 500), random(baseSpeed, maxSpeed), random([-1, 1]), 1);
    }
}

// COUNTDOWN
function timer()
{
    return int((millis() - startTime) / 1000);
}

// CHECKING TO SEE IF MOUSE CLICKS KILL BUGS & STOPPING USERS FROM DRAGGING MOUSE TO MULTIKILL BUGS
function mousePressed()
{
    let dmin = -1;
    let bug_id = -1;

    for (let i = 0; i < count; i++)
    {
        let d = bug[i].grabCheck();
        if (d != -1)
        {
            if (dmin == -1 || d < dmin)
            {
                dmin = d;
                bug_id = i;
                bug[bug_id].kill();
            }
        }
    }
}

function mouseDragged()
{
    for (let i = 0; i < count; i++)
    {
        bug[i].drag();
    }
}

function mouseReleased()
{
    for (let i = 0; i < count; i++)
    {
        bug[i].drop();
    }
}

function startScreen()
{
    textSize(30);
    text('SQUASH THE BUGS!', 150, 100);
    text('Click to start the game!', 150, 300);
    
    if (mouseIsPressed)
    {
        startTime = millis();
        gameState = 'playing';
    }
}

function playScreen()
{
    // START SOUND
    melodyStart.loop = 1;
    melodyStart.start();
    Tone.Transport.start();
    
    // PLAY SOUND
    melodyPlay.start();
    Tone.Transport.start();

    for (let i = 0; i < count; i++)
    {
        bug[i].draw();
    }
    
    let time = timer();
    let totalTime = 30;

    textSize(30);
    text("Time: " + (totalTime - time), 10, 30);
    text("Score: " + score, 10, 60);
    text("Hint: Faster bugs will spawn after each wave!", 200, 30);

    if (time >= totalTime)
    {
        gameState = 'end';
    }
}

function gameOver()
{
    // STOP PLAYING MUSIC ON GAME OVER
    melodyEnd.loop = 1;
    melodyStart.stop();
    melodyPlay.stop();
    melodyEnd.start();
    Tone.Transport.start();

    text("GAME OVER", 150, 100);
    text("Press ANY KEY to RESTART the game!", 150, 200);
    text("Final Score: " + score, 150, 350);

    if (keyIsPressed)
    {
        // RESETTING SCORE AND BUGS UPON RESTART
        baseSpeed = 1;
        maxSpeed = 1;
        score = 0;
        melodyPlay.playbackRate = 0.75;
        numDead = 5;

        melodyEnd.stop();
        
        startTime = millis();
        gameState = 'playing';
    }
}

function draw() 
{
    background(200,200,200);
    
    // SWITCHING GAME STATES
    if (gameState == 'wait')
    {
        startScreen();
    }

    else if (gameState == 'playing')
    {
        playScreen();
    }

    else if (gameState == 'end')
    {
        gameOver();
    }

    // BUG GENERATION -> IF # BUGS DEAD = 5 THEN SPAWN MORE BUGS
    if (numDead == count)
    {
        for (let j = 0; j < count; j++)
        {
                baseSpeed += 0.5;
                maxSpeed += 0.5;
                melodyPlay.playbackRate *= 1.05;  
                bug[j] = new Character(spritesheet, random(200, 500), random(200, 500), random(baseSpeed, maxSpeed), random([-1, 1]), 1);
                numDead = 0;
        }
    }
}

// EVERYTHING BUG RELATED
class Character
{
    constructor(spritesheet, x, y, speed, move, alive)
    {
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.move = 0;
        this.facing = 1;
        this.speed = speed;
        this.move = move;
        this.facing = move;
        this.grabbed = false;
        this.spriteFrame = 0;
        this.alive = alive;
    }

    animate()
    {
        let sx, sy;
        if (this.move == 0)
        {
            if (this.grabbed)
            {
                // animation for grab status
                sx = this.spriteFrame % 8 + 1;
                sy = 0;
            }
            else 
            {
                // animation for standing still
                sx = 0;
                sy = 0;
            }
            
            if (this.alive == 0)
            {
                sx = 10;
                sy = 0;
            }
        }

        else if (this.move == 1)
        {
            // animation for walking right
            sx = this.spriteFrame % 8 + 1;
            sy = 0;
        }

        else if (this.move == -1)
        {
            // animation for walking left
            sx = this.spriteFrame % 8 + 1;
            sy = 0;
        }

        else if (this.alive == 0)
        {
            sx = this.spriteFrame % 9 + 1;
            sy = 0;   
        }

        return [sx, sy];
    }

    draw() 
    {
        push();
        translate(this.x, this.y);
        scale(this.facing, 1);
    
        let [sx, sy] = this.animate();
        image(this.spritesheet, 0, 0, 100, 100, 160 * sx, 0 * sy, 140, 130);

        if (frameCount % 5 == 0)
        {
            this.spriteFrame += 1;
        }

        this.x += this.speed * this.move;

        if (this.x < 30)
        {
            this.move = 1;
            this.facing = 1;
        }

        else if (this.x > width - 30)
        {
            this.move = -1;
            this.facing = -1;
        }

        pop();
    }

    go(direction)
    {
        this.move = direction;
        this.facing = direction;
        this.sx = 3;
    }

    stop()
    {
        this.move = 0;
    }

    grabCheck()
    {
        let d = -1;

        if (mouseX > this.x - 30 && mouseX < this.x + 30 && mouseY > this.y - 30 && mouseY < this.y + 30)
        {
            d = dist(mouseX, mouseY, this.x, this.y);

        }

        return d;
    }

    kill()
    {
        if (mouseX > this.x - 30 && mouseX < this.x + 30 && mouseY > this.y - 30 && mouseY < this.y + 30)
        {
            this.moving = 0;
            if (this.alive == 1)
            {
                // PLAYING SQUISH SOUND AND ADDING SCORE UPON BUG KILL
                hit.start();
                numDead += 1;
                score += 1;
                this.alive = 0;
                this.stop();
            }
        }
    }

    grab()
    {
            this.stop();
            this.grabbed = true;
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
    }

    drag()
    {
        if (this.grabbed)
        {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }
    }

    drop()
    {
        if (this.grabbed)
        {
            this.go(this.facing);
            this.grabbed = false;
        }
    }   
}