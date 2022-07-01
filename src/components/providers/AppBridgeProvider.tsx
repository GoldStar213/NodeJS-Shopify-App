import { Banner, Layout, Page } from '@shopify/polaris';
import { useMemo, useState } from 'react';

// import { useLocation, useNavigate } from 'react-router-dom';
import { Provider } from '@shopify/app-bridge-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * A component to configure App Bridge.
 * @desc A thin wrapper around AppBridgeProvider that provides the following capabilities:
 *
 * 1. Ensures that navigating inside the app updates the host URL.
 * 2. Configures the App Bridge Provider, which unlocks functionality provided by the host.
 *
 * See: https://shopify.dev/apps/tools/app-bridge/react-components
 */
export function AppBridgeProvider({ children }) {
	const router = useRouter();

	console.log(router);

	const urlParams = new URLSearchParams(router.asPath.split('?')[1]);

	const query = Object.fromEntries(urlParams);

	console.log(query);

	// const [browserWindow, setBrowserWindow] = useState({});

	// useEffect(() => {
	// 	if (typeof window !== undefined) {
	// 		setBrowserWindow(window);
	// 	}
	// }, []);
	// const location = useLocation();
	// const navigate = useNavigate();
	// const history = useMemo(
	//   () => ({
	//     replace: (path) => {
	//       navigate(path, { replace: true });
	//     },
	//   }),
	//   [navigate]
	// );

	// const routerConfig = useMemo(
	//   () => ({ history, location }),
	//   [history, location]
	// );

	// The host may be present initially, but later removed by navigation.
	// By caching this in state, we ensure that the host is never lost.
	// During the lifecycle of an app, these values should never be updated anyway.
	// Using state in this way is preferable to useMemo.
	// See: https://stackoverflow.com/questions/60482318/version-of-usememo-for-caching-a-value-that-will-never-change
	const [appBridgeConfig] = useState(() => {
		const host = query.host;

		return {
			host,
			apiKey: process.env.SHOPIFY_API_KEY,
			forceRedirect: true,
		};
	});
	console.log(
		'🚀 ~ file: AppBridgeProvider.tsx ~ line 62 ~ const[appBridgeConfig]=useState ~ appBridgeConfig',
		appBridgeConfig
	);

	if (!process.env.SHOPIFY_API_KEY) {
		return (
			<Page narrowWidth>
				<Layout>
					<Layout.Section>
						<div style={{ marginTop: '100px' }}>
							<Banner title='Missing Shopify API key' status='critical'>
								Your app is running without the SHOPIFY_API_KEY environment
								variable. Please ensure that it is set when running or building
								your React app.
							</Banner>
						</div>
					</Layout.Section>
				</Layout>
			</Page>
		);
	}

	return <Provider config={appBridgeConfig}>{children}</Provider>;
}