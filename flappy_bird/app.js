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
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
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
    })

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
    this.physics.add.collider(bird, road);

    // this.physics.add.overlap(): checks if target body (first parameter) intersects with other given bodies
    // => arrow function defining
    // overlap check updates game state, collider manages physical interaction, ensures they behave according to physics engine
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);
}

// Used to update "bird" object, runs continually, responds to user interactions or changing variables
function update () {
}


