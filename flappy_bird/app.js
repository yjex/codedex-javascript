// Creating background for clone app


// Config object specifies parameters about the game created
// physics -> for the game's physics system, use arcade
let config = {
    renderer: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

// Creating game variable of a new instance of Phaser.game

let game = new Phaser.Game(config)

// Brings in images for application
function preload () {
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/column.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96});
}

// Define the bird variable outside the create() function -> Global scope purposes
let bird;

// hasLanded() variable: to determine when the game ends
// must have global scope (defined outside function) -> for use in other functions 
let hasLanded = false;

// cursors variable to allow user to move the bird
let cursors;

// hasBumped variable to detect if bird hit columns
let hasBumped = false;

// isGameStarted -> game only starts in response to a user action
let isGameStarted = false;

// instruction at the bottom of the screen 
let messageToPlayer;

// Generates elements appearing in the game

function create () {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);


    // topColumns variable: creates static column
    // repeat: creates one additional column
    // setXY: specifies first column's coordinates as (200, 0), second column to be 300 pixels to the right
    //write the topColumns before variable road -> Phaser adds elements in order
    
    const topColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY: {x: 200, y: 0, stepX: 300}
    });

    const bottomColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY: {x: 350, y: 400, stepX: 300}
    });

    // roads variable: creating a single, static road variable -> staticGroup specifies static body
    // setScale(): specifies that road is to be twice as big as its original size
    // refreshBody(): for physics to work with changing size -> syncs body's position and size with parent game object
    const roads = this.physics.add.staticGroup();
    const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

    // creating the bird sprite
    // as a sprite, bird has dynamic body -> dynamic bodies have gravity setting, falls
    // .setBounce(): bird to bound slightly (0.2) if it collides with something
    // .setCollideWorldBounds(): bird can bump into screen edges, cannot go through it
    // this.physics.add.collider: stops bird from falling through the road
    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);

    messageToPlayer = this.add.text(0, 0, 'Instructions: Press spacebar to start', {fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black"});
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50) // aligns messageToPlayer to the bottom center of the background image 

    // this.physics.add.overlap(): checks if target body (first parameter) intersects with other given bodies
    // => arrow function defining
    // overlap check updates game state, collider manages physical interaction - overlap comes first, ensures they behave according to physics engine
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);

    // .createCursorKeys() method creates and returns an object containing 4 hotkeys for up, down, left, right, spacebar, shift
    cursors = this.input.keyboard.createCursorKeys();

    // setting hasBumped to true/false depending on whether bird has hit column
    // overlap check updates game state, collider manages physical interaction - overlap comes first, ensures they behave according to physics engine
    this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
    this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this)
    this.physics.add.collider(bird, topColumns);
    this.physics.add.collider(bird, bottomColumns);

}

// Used to update "bird" object, runs continually, responds to user interactions or changing variables

function update () {

    // bird won't move unless isGameStarted is true 
    // if the game hasn't started, the bird gets a velocity of -160 in the y direction -> bird moves up instead of falling down
    if (!isGameStarted) {
        bird.setVelocityY(-160)
    }
    
    // if user presses the space key and isGameStarted variable is false (initial value), game starts
    if (cursors.space.isDown && !isGameStarted) {
        isGameStarted = true;
        messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or the ground';
    }
    
    // if user presses up button, the bird gets an upward velocity of -160 -> moves bird upwards
    if (cursors.up.isDown) {
        bird.setVelocityY(-160);
    }
    // prevents user from moving the bird if it lands on the ground -> bird cannot move up if it has landed
    if (cursors.up.isDown && !hasLanded) {
        bird.setVelocityY(-160);
    }
    // bird continuously moving right
    if(!hasLanded) {
        bird.body.velocity.x = 50;
    }
   
    //if bird bumps into column, stop moving right
    if (cursors.up.isDown && !hasLanded && !hasBumped) {
        bird.setVelocityY(-160);
    }

    // if bird has not landed or has not bumped, bird moves at 50 velocity in the x direction
    if (!hasLanded || !hasBumped) {
        bird.body.velocity.x = 50;
    } 

    // if it has landed or has bumped, bird doesn't move
    if (hasLanded || hasBumped  ) {
        bird.body.velocity.x = 0;
        bird.setVelocityY(160);
    }
    
    // if game has not started, bird doesn't move
    if (!isGameStarted) {
        bird.body.velocity.x = 0;
    }

    // creating game ending: when bird reaches far right of the screen
    if (bird.x > 750) {
        bird.setVelocityY(40);
        messageToPlayer.text = "Congrats! You won!";
    }

    if (hasLanded || hasBumped) {
        bird.body.velocity.x = 0;
        messageToPlayer.text = "Oh no! You crashed!"
    }
}
