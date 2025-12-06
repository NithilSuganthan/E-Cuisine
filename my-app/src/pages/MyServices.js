import React from 'react';

export default function MyServices() {
	// Placeholder content: in a real app this would show services the current user manages
	const services = [
		{ id: '1', servicename: 'Homely Meals', description: 'Daily home-cooked lunch' }
	];

	return (
		<div style={{ padding: 20 }}>
			<h2>My Services</h2>
			<ul>
				{services.map(s => (
					<li key={s.id}>
						<strong>{s.servicename}</strong> — {s.description}
					</li>
				))}
			</ul>
		</div>
	);
}
