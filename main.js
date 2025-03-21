let screen = document.getElementById("display").getContext("2d");
let screen_size = [450, 253];

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
let axes = document.getElementById("axes");
let node_displacement = document.getElementById("node-displacement");
let simulation_speed = document.getElementById("simulation-speed");

let ymax_input = document.getElementById("ymax");
let xmax_input = document.getElementById("xmax");

// Appearence
let y1_color = document.getElementById("y1-color");
let y2_color = document.getElementById("y2-color");
let final_wave_color = document.getElementById("final-wave-color");
let node_color = document.getElementById("node-color");

let y1_line_width = document.getElementById("y1-line-width");
let y2_line_width = document.getElementById("y2-line-width");
let final_wave_line_width = document.getElementById("final-wave-line-width");
let node_radius = document.getElementById("node-radius");

// Variables
let ymax = Math.SQRT2,
    xmax = 2*Math.PI;

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
let _nodes = []

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

    draw()
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

function cartesian_to_canvas(x, y)
{
    return [
        x * (screen_size[0]/xmax),
        - y * (screen_size[1]/(2*ymax)) + screen_size[1]/2
    ]
}

function plot(wave, color, line_width, nodes=false)
{
    for (let x = 0; x < xmax; x += xmax/1000)
    {
        let plot_coords = cartesian_to_canvas(x, wave(x, t));
        screen.fillStyle = color;
        screen.fillRect(plot_coords[0], plot_coords[1], line_width, line_width);

        if ((screen_size[1]/2-ymax/3 <= plot_coords[1])
         && (plot_coords[1] <= screen_size[1]/2+ymax/3)
         && nodes)
        {
            _nodes.push([plot_coords[0], screen_size[1]/2])
        }
    }
}

function draw()
{
    screen.clearRect(0, 0, screen_size[0], screen_size[1]);
    _nodes = []

    plot(y1, y1_color.value, y1_line_width.value);
    plot(y2, y2_color.value, y2_line_width.value);

    if (total_wave.checked)
    {
        plot((x, t) => y1(x,t) + y2(x,t), final_wave_color.value, final_wave_line_width.value, node_displacement.checked)
    }

    if (axes.checked)
    {
        screen.lineWidth=7;
        screen.beginPath();
        screen.moveTo(0, 0);
        screen.lineTo(0, screen_size[1]);
        screen.stroke();

        screen.lineWidth=3.5;
        screen.beginPath();
        screen.moveTo(0, screen_size[1]/2);
        screen.lineTo(screen_size[0], screen_size[1]/2);
        screen.stroke();
    }

    for (node of _nodes)
    {
        screen.fillStyle = node_color.value;
        screen.beginPath()
        screen.arc(node[0], node[1], node_radius.value, 0, 2*Math.PI)
        screen.fill()

        screen.fillStyle = "black";
        screen.beginPath()
        screen.arc(node[0], node[1], node_radius.value, 0, 2*Math.PI)
        screen.stroke()
    }
}

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

    let new_ymax = parseFloat(ymax_input.value ? ymax_input.value : Math.SQRT2);
    let new_xmax = parseFloat(xmax_input.value ? xmax_input.value : 2*Math.PI);

    if ((new_ymax != ymax) && (new_ymax || new_ymax == 0)) { ymax = new_ymax; }
    if ((new_xmax != xmax) && (new_xmax || new_xmax == 0)) { xmax = new_xmax; }

    draw();

    if (!active) return;

    t += dt/1000 * simulation_speed.value;
    time_elapsed.textContent = t.toFixed(2);
}, 0);