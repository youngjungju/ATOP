<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkinScan - Atopic Dermatitis Analysis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        .hero-bg {
            background: radial-gradient(circle at top left, #e0f2fe 0%, #f0fdf4 40%, #ffffff 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        /* Abstract decorative shapes */
        .shape {
            position: absolute;
            filter: blur(80px);
            z-index: 0;
            opacity: 0.6;
        }

        .shape-1 {
            width: 400px;
            height: 400px;
            background: #dcfce7;
            top: -100px;
            right: -100px;
            border-radius: 50%;
        }

        .shape-2 {
            width: 300px;
            height: 300px;
            background: #e0f2fe;
            bottom: -50px;
            left: -50px;
            border-radius: 50%;
        }

        .upload-container {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .upload-container:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        .pulse-soft {
            animation: pulse-soft 3s infinite;
        }

        @keyframes pulse-soft {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.02); opacity: 0.95; }
        }
    </style>
</head>
<body class="bg-slate-50">

    <section class="hero-bg px-4 py-20 relative">
        <!-- Background Shapes -->
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>

        <div class="max-w-4xl w-full mx-auto text-center relative z-10">
            <!-- Header/Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                AI-Powered Skin Care Support
            </div>

            <!-- Heading -->
            <h1 class="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                Clearer skin starts with <br/>
                <span class="text-emerald-600">understanding.</span>
            </h1>
            
            <p class="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Take a clear photo of your skin concern for a detailed analysis and supportive report. We're here to help you manage your journey with confidence.
            </p>

            <!-- Upload Section -->
            <div class="max-w-md mx-auto">
                <label for="file-upload" class="upload-container block cursor-pointer bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-colors bg-opacity-80 backdrop-blur-sm">
                    <div class="flex flex-col items-center">
                        <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 pulse-soft">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-slate-800 mb-2">Upload a Photo</h3>
                        <p class="text-slate-500 text-sm mb-6">JPEG, PNG or HEIC files up to 10MB</p>
                        
                        <div class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-emerald-200 transition-all">
                            Select from device
                        </div>
                    </div>
                    <input id="file-upload" type="file" class="hidden" accept="image/*" onchange="handleFile(event)" />
                </label>
            </div>

            <!-- Trust Markers -->
            <div class="mt-16 flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Secure & Private
                </div>
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Instant Results
                </div>
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    Patient-First Design
                </div>
            </div>
        </div>

        <!-- Hidden Loading Overlay (Simulation) -->
        <div id="loading-state" class="hidden fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center backdrop-blur-md">
            <div class="text-center">
                <div class="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-slate-600 font-medium">Analyzing your photo with care...</p>
            </div>
        </div>
    </section>

    <script>
        function handleFile(event) {
            const file = event.target.files[0];
            if (file) {
                const loading = document.getElementById('loading-state');
                loading.classList.remove('hidden');
                
                // Simulate processing delay
                setTimeout(() => {
                    loading.innerHTML = `
                        <div class="max-w-md p-8 text-center">
                            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </div>
                            <h2 class="text-2xl font-bold text-slate-800 mb-2">Photo Received</h2>
                            <p class="text-slate-600 mb-6">Our analysis engine is generating your personalized report. This usually takes less than a minute.</p>
                            <button onclick="location.reload()" class="text-emerald-600 font-medium hover:underline">Cancel and go back</button>
                        </div>
                    `;
                }, 2000);
            }
        }
    </script>
</body>
</html>