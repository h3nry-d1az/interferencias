let screen = document.getElementById("display").getContext("2d");
let screen_size = (450, 253);

screen.moveTo(0, 0);
screen.lineTo(500, 281);
screen.stroke();

// Control buttons
let start_button = document.getElementById("start-button");
let end_button = document.getElementById("end-button");
let time_elapsed = document.getElementById("time-elapsed");

// Wave inputs
let A1_input = document.getElementById("A1");
let A2_input = document.getElementById("A2");
let omega1_input = document.getElementById("omega1");
let omega2_input = document.getElementById("omega2");
let k1_input = document.getElementById("k1");
let k2_input = document.getElementById("k2");
let phi1_input = document.getElementById("phi1");
let phi2_input = document.getElementById("phi2");

// Output data
let lambda1_span = document.getElementById("lambda1");
let lambda2_span = document.getElementById("lambda2");
let T1_span = document.getElementById("T1");
let T2_span = document.getElementById("T2");
let f1_span = document.getElementById("f1");
let f2_span = document.getElementById("f2");
let vp1_span = document.getElementById("vp1");
let vp2_span = document.getElementById("vp2");

// Settings
let total_wave = document.getElementById("total-wave");
let node_displacement = document.getElementById("node-displacement");
let simulation_speed = document.getElementById("simulation-speed");

let ymax_input = document.getElementById("ymax");
let xmax_input = document.getElementById("xmax");

// Variables
let ymax = 0,
    xmax = 0;

let A1 = 1,
    A2 = 1,
    omega1 = 1,
    omega2 = 1,
    k1 = 1,
    k2 = 1,
    phi1 = 0,
    phi2 = Math.PI/2;

let active = false;
let t = 0;

let _timestamp = Date.now();

function start()
{
    active = !active;
    if (active) { start_button.textContent = "⏸︎ Pausar"; }
    if (!active) { start_button.textContent = "⏵︎ Comenzar"; }
}

function terminate()
{
    t = 0;
    time_elapsed.textContent = "0";
    active = false;
    start_button.textContent = "⏵︎ Comenzar";
}

function recalculate_data()
{
    lambda1_span.textContent = ((2*Math.PI)/k1).toFixed(2);
    lambda2_span.textContent = ((2*Math.PI)/k2).toFixed(2);
    T1_span.textContent = ((2*Math.PI)/omega1).toFixed(2);
    T2_span.textContent = ((2*Math.PI)/omega2).toFixed(2);
    f1_span.textContent = (omega1/(2*Math.PI)).toFixed(2);
    f2_span.textContent = (omega2/(2*Math.PI)).toFixed(2);
    vp1_span.textContent = (omega1/k1).toFixed(2);
    vp2_span.textContent = (omega2/k2).toFixed(2);
}

function y1(x, t) { return A1*Math.sin(omega1*t - k1*x + phi1); }
function y2(x, t) { return A2*Math.sin(omega2*t - k2*x + phi2); }

setInterval(function ()
{
    dt = Date.now() - _timestamp;
    // console.log(dt)
    _timestamp += dt;

    let new_A1 = parseFloat(A1_input.value ? A1_input.value : 1);
    let new_A2 = parseFloat(A2_input.value ? A2_input.value : 1);
    let new_omega1 = parseFloat(omega1_input.value ? omega1_input.value : 1);
    let new_omega2 = parseFloat(omega2_input.value ? omega2_input.value : 1);
    let new_k1 = parseFloat(k1_input.value ? k1_input.value : 1);
    let new_k2 = parseFloat(k2_input.value ? k2_input.value : 1);
    let new_phi1 = parseFloat(phi1_input.value ? phi1_input.value : 0);
    let new_phi2 = parseFloat(phi2_input.value ? phi2_input.value : Math.PI/2);

    let changes = false;

    if ((new_A1 != A1) && (new_A1 || new_A1 == 0)) { A1 = new_A1; changes = true; }
    if ((new_A2 != A2) && (new_A2 || new_A2 == 0)) { A2 = new_A2; changes = true; }
    if ((new_omega1 != omega1) && (new_omega1 || new_omega1 == 0)) { omega1 = new_omega1; changes = true; }
    if ((new_omega2 != omega2) && (new_omega2 || new_omega2 == 0)) { omega2 = new_omega2; changes = true; }
    if ((new_k1 != k1) && (new_k1 || new_k1 == 0)) { k1 = new_k1; changes = true; }
    if ((new_k2 != k2) && (new_k2 || new_k2 == 0)) { k2 = new_k2; changes = true; }
    if ((new_phi1 != phi1) && (new_phi1 || new_phi1 == 0)) { phi1 = new_phi1; changes = true; }
    if ((new_phi2 != phi2) && (new_phi2 || new_phi2 == 0)) { phi2 = new_phi2; changes = true; }

    if (changes) { recalculate_data() };

    if (!active) return;

    t += dt/1000 * simulation_speed.value;
    time_elapsed.textContent = t.toFixed(2);
}, 0);