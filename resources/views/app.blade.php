<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Force light theme --}}
        <script>
            (function() {
                // Force light theme - run immediately and also on DOMContentLoaded
                function forceLightTheme() {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    
                    // Also remove dark from body if it exists
                    document.body.classList.remove('dark');
                    document.body.classList.add('light');
                    
                    // Prevent any dark mode detection
                    if (window.matchMedia) {
                        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', forceLightTheme);
                    }
                }
                
                // Run immediately
                forceLightTheme();
                
                // Run when DOM is ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', forceLightTheme);
                } else {
                    forceLightTheme();
                }
                
                // Run periodically to ensure it stays light
                setInterval(forceLightTheme, 1000);
            })();
        </script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        {{-- Force light theme CSS --}}
        <style>
            /* Override any dark mode styles */
            html.dark, body.dark {
                color-scheme: light !important;
            }
            
            /* Force light colors even if dark class is present */
            html.dark {
                --background: oklch(1 0 0) !important;
                --foreground: oklch(0.145 0 0) !important;
                --card: oklch(1 0 0) !important;
                --card-foreground: oklch(0.145 0 0) !important;
                --popover: oklch(1 0 0) !important;
                --popover-foreground: oklch(0.145 0 0) !important;
                --primary: oklch(0.205 0 0) !important;
                --primary-foreground: oklch(0.985 0 0) !important;
                --secondary: oklch(0.97 0 0) !important;
                --secondary-foreground: oklch(0.205 0 0) !important;
                --muted: oklch(0.97 0 0) !important;
                --muted-foreground: oklch(0.556 0 0) !important;
                --accent: oklch(0.97 0 0) !important;
                --accent-foreground: oklch(0.205 0 0) !important;
                --destructive: oklch(0.577 0.245 27.325) !important;
                --destructive-foreground: oklch(0.577 0.245 27.325) !important;
                --border: oklch(0.922 0 0) !important;
                --input: oklch(0.922 0 0) !important;
                --ring: oklch(0.87 0 0) !important;
                --sidebar: oklch(0.985 0 0) !important;
                --sidebar-foreground: oklch(0.145 0 0) !important;
                --sidebar-primary: oklch(0.205 0 0) !important;
                --sidebar-primary-foreground: oklch(0.985 0 0) !important;
                --sidebar-accent: oklch(0.97 0 0) !important;
                --sidebar-accent-foreground: oklch(0.205 0 0) !important;
                --sidebar-border: oklch(0.922 0 0) !important;
                --sidebar-ring: oklch(0.87 0 0) !important;
            }
            
            /* Ensure body background is always light */
            body {
                background-color: oklch(1 0 0) !important;
                color: oklch(0.145 0 0) !important;
            }
        </style>

        {{-- Expose Laravel asset base for React (handles subdirectory deploys) --}}
        <meta name="asset-base" content="{{ rtrim(asset('/'), '/') }}/" />

        <link rel="icon" href="{{ asset('1.png') }}" sizes="any">
        <link rel="icon" href="{{ asset('1.png') }}" type="image/png">
        <link rel="apple-touch-icon" href="{{ asset('1.png') }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
