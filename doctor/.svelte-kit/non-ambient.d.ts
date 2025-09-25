
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(main)" | "/(auth)" | "/" | "/(main)/appointment" | "/(main)/appointment/[id]" | "/(main)/appointment/[id]/edit-medical-record" | "/(main)/appointment/[id]/new-medical-record" | "/(auth)/login" | "/(main)/notification" | "/(auth)/request" | "/(auth)/reset" | "/(main)/settings";
		RouteParams(): {
			"/(main)/appointment/[id]": { id: string };
			"/(main)/appointment/[id]/edit-medical-record": { id: string };
			"/(main)/appointment/[id]/new-medical-record": { id: string }
		};
		LayoutParams(): {
			"/(main)": { id?: string };
			"/(auth)": Record<string, never>;
			"/": { id?: string };
			"/(main)/appointment": { id?: string };
			"/(main)/appointment/[id]": { id: string };
			"/(main)/appointment/[id]/edit-medical-record": { id: string };
			"/(main)/appointment/[id]/new-medical-record": { id: string };
			"/(auth)/login": Record<string, never>;
			"/(main)/notification": Record<string, never>;
			"/(auth)/request": Record<string, never>;
			"/(auth)/reset": Record<string, never>;
			"/(main)/settings": Record<string, never>
		};
		Pathname(): "/" | "/appointment" | "/appointment/" | `/appointment/${string}` & {} | `/appointment/${string}/` & {} | `/appointment/${string}/edit-medical-record` & {} | `/appointment/${string}/edit-medical-record/` & {} | `/appointment/${string}/new-medical-record` & {} | `/appointment/${string}/new-medical-record/` & {} | "/login" | "/login/" | "/notification" | "/notification/" | "/request" | "/request/" | "/reset" | "/reset/" | "/settings" | "/settings/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/base.png" | "/icons/128x128.png" | "/icons/144x144.png" | "/icons/152x152.png" | "/icons/192x192.png" | "/icons/256x256.png" | "/icons/512x512.png" | "/icons/apple-icon-180.png" | "/icons/apple-touch-icon.png" | "/icons/favicon-196.png" | "/icons/favicon.png" | "/icons/manifest-icon-192.maskable.png" | "/icons/manifest-icon-512.maskable.png" | "/icons/mstile-icon-128.png" | "/icons/mstile-icon-270.png" | "/icons/mstile-icon-558-270.png" | "/icons/mstile-icon-558.png" | "/img/bg-image.webp" | "/img/bg-image2.webp" | "/img/bg.webp" | "/img/complete-reg.webp" | "/img/doctor.webp" | "/img/logo.png" | "/img/medical_records.webp" | "/img/prescriptions.webp" | "/img/prescriptionss.webp" | "/img/tests.webp" | "/img/vitals.webp" | "/manifest.json" | string & {};
	}
}