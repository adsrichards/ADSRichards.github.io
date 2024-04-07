// shader credit: https://www.shadertoy.com/view/4s2yW1 "Bokeh Paralax" created by knarkowicz (modified)

// Get the canvas element
const canvas = document.getElementById('c');

// Get WebGL context
const gl = canvas.getContext('webgl');

// Define the vertex shader source code (a simple passthrough shader)
const vertexShaderSource = `
    attribute vec4 position;
    void main() {
        gl_Position = position;
    }
`;

// Define the fragment shader source code
const fragmentShaderSource = `
    precision mediump float;

    uniform vec2 iResolution;
    uniform float iTime;

    const float MATH_PI	= float( 3.14159265359 );

    void Rotate( inout vec2 p, float a ) 
    {
    	p = cos( a ) * p + sin( a ) * vec2( p.y, -p.x );
    }
    
    float Circle( vec2 p, float r )
    {
        return ( length( p / r ) - 1.0 ) * r;
    }
    
    float Rand( vec2 c )
    {
    	return fract( sin( dot( c.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
    }
    
    float saturate( float x )
    {
    	return clamp( x, 0.0, 1.0 );
    }
    
    void BokehLayer( inout vec3 color, vec2 p, vec3 c )   
    {
        float wrap = 450.0;    
        if ( mod( floor( p.y / wrap + 0.5 ), 2.0 ) == 0.0 )
        {
            p.x += wrap * 0.5;
        }    
        
        vec2 p2 = mod( p + 0.5 * wrap, wrap ) - 0.5 * wrap;
        vec2 cell = floor( p / wrap + 0.5 );
        float cellR = Rand( cell );
            
        c *= fract( cellR * 3.33 + 3.33 );    
        float radius = mix( 30.0, 70.0, fract( cellR * 7.77 + 7.77 ) );
        p2.x *= mix( 0.9, 1.1, fract( cellR * 11.13 + 11.13 ) );
        p2.y *= mix( 0.9, 1.1, fract( cellR * 17.17 + 17.17 ) );
        
        float sdf = Circle( p2, radius );
        float circle = 1.0 - smoothstep( 0.0, 2.0, sdf * 0.08 );
        float glow	 = exp( -sdf * 0.025 ) * 0.4 * ( 1.0 - circle );
        color += c * ( circle + glow );
    }
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {    
    	vec2 uv = fragCoord.xy / iResolution.xy;
    	vec2 p = ( 2.0 * fragCoord - iResolution.xy ) / iResolution.x * 1000.0;
        
        // background
        vec3 color = mix( vec3( 0.1, 0.1, 0.7 ), vec3( 0., 0., 0. ), dot( uv, vec2( 0.2, 0.7 ) ) );
    
        float time = iTime - 15.0;
        
        Rotate( p, 0.2 + time * 0.03 );
        BokehLayer( color, p + vec2( -50.0 * time +  0.0, 0.0  ), 3.0 * vec3( 0.0, 0.1, 0.87 ) );
        Rotate( p, 0.3 - time * 0.05 );
        BokehLayer( color, p + vec2( -70.0 * time + 33.0, -33.0 ), 3.5 * vec3( 0.26, 0.4, 0.872 ) );
        Rotate( p, 0.5 + time * 0.07 );
        BokehLayer( color, p + vec2( -60.0 * time + 55.0, 55.0 ), 3.0 * vec3( 0.24, 0.3, 0.852 ) );
        Rotate( p, 0.9 - time * 0.03 );
        BokehLayer( color, p + vec2( -25.0 * time + 77.0, 77.0 ), 3.0 * vec3( 0.024, 0.2, 0.831 ) );    
        Rotate( p, 0.0 + time * 0.05 );
        BokehLayer( color, p + vec2( -15.0 * time + 99.0, 99.0 ), 3.0 * vec3( 0.02, 0.0, 0.74 ) );      
    
    	fragColor = vec4( color, 1.0 );
    }

    void main() {
        vec4 fragColor;
        mainImage(fragColor, gl_FragCoord.xy);
        gl_FragColor = fragColor;
    }
`;

// Create vertex shader object
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// Create fragment shader object
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Create shader program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Get attribute and uniform locations
const positionAttributeLocation = gl.getAttribLocation(program, 'position');
const resolutionUniformLocation = gl.getUniformLocation(program, 'iResolution');
const timeUniformLocation = gl.getUniformLocation(program, 'iTime');

// Create buffer and set geometry
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [-1, -1, -1, 1, 1, -1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Set attribute pointer
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// Set clear color to black
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Define a function to update the animation
function updateAnimation(time) {
    // Calculate time in seconds
    const currentTime = time * 0.001;

    // Set uniform values
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    gl.uniform1f(timeUniformLocation, currentTime);

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the shader
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Request the next frame
    requestAnimationFrame(updateAnimation);
}

// Start the animation
requestAnimationFrame(updateAnimation);
