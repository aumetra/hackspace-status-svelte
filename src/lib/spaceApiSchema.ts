import { z } from 'zod';

export default z
	.object({
		api: z.literal('0.13').describe('The version of SpaceAPI your endpoint uses'),
		space: z.string().describe('The name of your space'),
		logo: z.string().describe('URL to your space logo'),
		url: z.string().describe('URL to your space website'),
		location: z
			.object({
				address: z
					.string()
					.describe(
						'The postal address of your space (street, block, housenumber, zip code, city, whatever you usually need in your country, and the country itself).<br>Examples: <ul><li>Netzladen e.V., Breite Straße 74, 53111 Bonn, Germany</li></ul>'
					)
					.optional(),
				lat: z
					.number()
					.describe(
						'Latitude of your space location, in degree with decimal places. Use positive values for locations north of the equator, negative values for locations south of equator.'
					),
				lon: z
					.number()
					.describe(
						'Longitude of your space location, in degree with decimal places. Use positive values for locations east of Greenwich, and negative values for locations west of Greenwich.'
					)
			})
			.describe('Position data such as a postal address or geographic coordinates'),
		spacefed: z
			.object({
				spacenet: z
					.boolean()
					.describe(
						'See the <a target="_blank" href="https://spacefed.net/wiki/index.php/Category:Howto/Spacenet">wiki</a>.'
					),
				spacesaml: z
					.boolean()
					.describe(
						'See the <a target="_blank" href="https://spacefed.net/wiki/index.php/Category:Howto/Spacesaml">wiki</a>.'
					),
				spacephone: z
					.boolean()
					.describe(
						'See the <a target="_blank" href="https://spacefed.net/wiki/index.php/Category:Howto/Spacephone">wiki</a>.'
					)
			})
			.describe(
				'A flag indicating if the hackerspace uses SpaceFED, a federated login scheme so that visiting hackers can use the space WiFi with their home space credentials.'
			)
			.optional(),
		cam: z.array(z.string()).min(1).describe('URL(s) of webcams in your space').optional(),
		stream: z
			.object({
				m4: z
					.string()
					.describe(
						'Your mpg stream URL. Example: <samp>{"mp4": "http://example.org/stream.mpg"}</samp>'
					)
					.optional(),
				mjpeg: z
					.string()
					.describe(
						'Your mjpeg stream URL. Example: <samp>{"mjpeg": "http://example.org/stream.mjpeg"}</samp>'
					)
					.optional(),
				ustream: z
					.string()
					.describe(
						'Your ustream stream URL. Example: <samp>{"ustream": "http://www.ustream.tv/channel/hackspsps"}</samp>'
					)
					.optional()
			})
			.describe(
				'A mapping of stream types to stream URLs. If you use other stream types make a <a href="https://github.com/spaceapi/schema/pulls" target="_blank">pull request</a> or prefix yours with <samp>ext_</samp>.'
			)
			.optional(),
		state: z
			.object({
				open: z
					.union([
						z
							.boolean()
							.describe(
								"A flag which indicates if the space is currently open or closed. The state 'undefined' can be achieved by assigning this field the value 'null' (without the quotes). In most (all?) programming languages this is evaluated to false so that no app should break"
							),
						z
							.null()
							.describe(
								"A flag which indicates if the space is currently open or closed. The state 'undefined' can be achieved by assigning this field the value 'null' (without the quotes). In most (all?) programming languages this is evaluated to false so that no app should break"
							)
					])
					.describe(
						"A flag which indicates if the space is currently open or closed. The state 'undefined' can be achieved by assigning this field the value 'null' (without the quotes). In most (all?) programming languages this is evaluated to false so that no app should break"
					),
				lastchange: z
					.number()
					.describe('The Unix timestamp when the space status changed most recently')
					.optional(),
				trigger_person: z
					.string()
					.describe('The person who lastly changed the state e.g. opened or closed the space.')
					.optional(),
				message: z
					.string()
					.describe(
						"An additional free-form string, could be something like <samp>'open for public'</samp>, <samp>'members only'</samp> or whatever you want it to be"
					)
					.optional(),
				icon: z
					.object({
						open: z
							.string()
							.describe('The URL to your customized space logo showing an open space'),
						closed: z
							.string()
							.describe('The URL to your customized space logo showing a closed space')
					})
					.describe('Icons that show the status graphically')
					.optional()
			})
			.describe(
				'A collection of status-related data: actual open/closed status, icons, last change timestamp etc.'
			),
		events: z
			.array(
				z.object({
					name: z
						.string()
						.describe(
							'Name or other identity of the subject (e.g. <samp>J. Random Hacker</samp>, <samp>fridge</samp>, <samp>3D printer</samp>, …)'
						),
					type: z
						.string()
						.describe(
							'Action (e.g. <samp>check-in</samp>, <samp>check-out</samp>, <samp>finish-print</samp>, …). Define your own actions and use them consistently, canonical actions are not (yet) specified'
						),
					timestamp: z.number().describe('Unix timestamp when the event occurred'),
					extra: z
						.string()
						.describe('A custom text field to give more information about the event')
						.optional()
				})
			)
			.describe(
				"Events which happened recently in your space and which could be interesting to the public, like 'User X has entered/triggered/did something at timestamp Z'"
			)
			.optional(),
		contact: z
			.object({
				phone: z
					.string()
					.describe(
						'Phone number, including country code with a leading plus sign. Example: <samp>+1 800 555 4567</samp>'
					)
					.optional(),
				sip: z
					.string()
					.describe(
						'URI for Voice-over-IP via SIP. Example: <samp>sip:yourspace@sip.example.org</samp>'
					)
					.optional(),
				keymasters: z
					.array(
						z.object({
							name: z.string().describe('Real name').optional(),
							irc_nick: z
								.string()
								.describe(
									'Contact the person with this nickname directly in irc if available. The irc channel to be used is defined in the contact/irc field.'
								)
								.optional(),
							phone: z
								.string()
								.describe("Example: <samp>['+1 800 555 4567','+1 800 555 4544']</samp>")
								.optional(),
							email: z.string().describe('Email address which can be base64 encoded.').optional(),
							twitter: z
								.string()
								.describe('Twitter username with leading <samp>@</samp>.')
								.optional()
						})
					)
					.min(1)
					.describe(
						'Persons who carry a key and are able to open the space upon request. One of the fields irc_nick, phone, email or twitter must be specified.'
					)
					.optional(),
				irc: z
					.string()
					.describe(
						'URL of the IRC channel, in the form <samp>irc://example.org/#channelname</samp>'
					)
					.optional(),
				twitter: z.string().describe('Twitter handle, with leading @').optional(),
				facebook: z.string().describe('Facebook account URL.').optional(),
				google: z
					.object({ plus: z.string().describe('Google plus URL.').optional() })
					.describe('Google services.')
					.optional(),
				identica: z
					.string()
					.describe(
						'Identi.ca or StatusNet account, in the form <samp>yourspace@example.org</samp>'
					)
					.optional(),
				foursquare: z
					.string()
					.describe('Foursquare ID, in the form <samp>4d8a9114d85f3704eab301dc</samp>.')
					.optional(),
				email: z
					.string()
					.describe(
						'E-mail address for contacting your space. If this is a mailing list consider to use the contact/ml field.'
					)
					.optional(),
				ml: z
					.string()
					.describe(
						'The e-mail address of your mailing list. If you use Google Groups then the e-mail looks like <samp>your-group@googlegroups.com</samp>.'
					)
					.optional(),
				jabber: z
					.string()
					.describe(
						'A public Jabber/XMPP multi-user chatroom in the form <samp>chatroom@conference.example.net</samp>'
					)
					.optional(),
				issue_mail: z
					.string()
					.describe(
						'A separate email address for issue reports (see the <em>issue_report_channels</em> field). This value can be Base64-encoded.'
					)
					.optional()
			})
			.describe(
				'Contact information about your space. You must define at least one which is in the list of allowed values of the issue_report_channels field.'
			),
		issue_report_channels: z
			.array(z.enum(['email', 'issue_mail', 'twitter', 'ml']))
			.min(1)
			.describe(
				"This array defines all communication channels where you want to get automated issue reports about your SpaceAPI endpoint from the revalidator. This field is meant for internal usage only and it should never be consumed by any app. At least one channel must be defined. Please consider that when using <samp>ml</samp> the mailing list moderator has to moderate incoming emails or add the sender email to the subscribers. If you don't break your SpaceAPI implementation you won't get any notifications ;-)"
			),
		sensors: z
			.object({
				temperature: z
					.array(
						z.object({
							value: z.number().describe('The sensor value'),
							unit: z
								.enum(['°C', '°F', 'K', '°De', '°N', '°R', '°Ré', '°Rø'])
								.describe('The unit of the sensor value.'),
							location: z
								.string()
								.describe(
									'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
								),
							name: z
								.string()
								.describe(
									'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe(
						'Temperature sensor. To convert from one unit of temperature to another consider <a href="http://en.wikipedia.org/wiki/Temperature_conversion_formulas" target="_blank">Wikipedia</a>.'
					)
					.optional(),
				door_locked: z
					.array(
						z.object({
							value: z.boolean().describe('The sensor value'),
							location: z
								.string()
								.describe(
									'The location of your sensor such as <samp>front door</samp>, <samp>chill room</samp> or <samp>lab</samp>.'
								),
							name: z
								.string()
								.describe(
									'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe('Sensor type to indicate if a certain door is locked.')
					.optional(),
				barometer: z
					.array(
						z.object({
							value: z.number().describe('The sensor value'),
							unit: z
								.literal('hPA')
								.describe(
									'The unit of the sensor value. You should always define the unit though if the sensor is a flag of a boolean type then you can of course omit it.'
								),
							location: z
								.string()
								.describe(
									'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
								),
							name: z
								.string()
								.describe(
									'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe('Barometer sensor')
					.optional(),
				radiation: z
					.object({
						alpha: z
							.array(
								z.object({
									value: z
										.number()
										.describe(
											'Observed counts per minute (ocpm) or actual radiation value. If the value are the observed counts then the dead_time and conversion_factor fields must be defined as well. CPM formula: <div>cpm = ocpm ( 1 + 1 / (1 - ocpm x dead_time) )</div> Conversion formula: <div>µSv/h = cpm x conversion_factor</div>'
										),
									unit: z
										.enum(['cpm', 'r/h', 'µSv/h', 'mSv/a', 'µSv/a'])
										.describe('Choose the appropriate unit for your radiation sensor instance.'),
									dead_time: z
										.number()
										.describe(
											'The dead time in µs. See the description of the value field to see how to use the dead time.'
										)
										.optional(),
									conversion_factor: z
										.number()
										.describe(
											'The conversion from the <em>cpm</em> unit to another unit hardly depends on your tube type. See the description of the value field to see how to use the conversion factor. <strong>Note:</strong> only trust your manufacturer if it comes to the actual factor value. The internet seems <a rel="nofollow" href="http://sapporohibaku.wordpress.com/2011/10/15/conversion-factor/" target="_blank">full of wrong copy & pastes</a>, don\'t even trust your neighbour hackerspace. If in doubt ask the tube manufacturer.'
										)
										.optional(),
									location: z
										.string()
										.describe(
											'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
										)
										.optional(),
									name: z
										.string()
										.describe(
											'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
										)
										.optional(),
									description: z
										.string()
										.describe(
											'An extra field that you can use to attach some additional information to this sensor instance.'
										)
										.optional()
								})
							)
							.describe('An alpha sensor')
							.optional(),
						beta: z
							.array(
								z.object({
									value: z
										.number()
										.describe(
											'Observed counts per minute (ocpm) or actual radiation value. If the value are the observed counts then the dead_time and conversion_factor fields must be defined as well. CPM formula: <div>cpm = ocpm ( 1 + 1 / (1 - ocpm x dead_time) )</div> Conversion formula: <div>µSv/h = cpm x conversion_factor</div>'
										),
									unit: z
										.enum(['cpm', 'r/h', 'µSv/h', 'mSv/a', 'µSv/a'])
										.describe('Choose the appropriate unit for your radiation sensor instance.'),
									dead_time: z
										.number()
										.describe(
											'The dead time in µs. See the description of the value field to see how to use the dead time.'
										)
										.optional(),
									conversion_factor: z
										.number()
										.describe(
											'The conversion from the <em>cpm</em> unit to another unit hardly depends on your tube type. See the description of the value field to see how to use the conversion factor. <strong>Note:</strong> only trust your manufacturer if it comes to the actual factor value. The internet seems <a rel="nofollow" href="http://sapporohibaku.wordpress.com/2011/10/15/conversion-factor/" target="_blank">full of wrong copy & pastes</a>, don\'t even trust your neighbour hackerspace. If in doubt ask the tube manufacturer.'
										)
										.optional(),
									location: z
										.string()
										.describe(
											'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
										)
										.optional(),
									name: z
										.string()
										.describe(
											'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
										)
										.optional(),
									description: z
										.string()
										.describe(
											'An extra field that you can use to attach some additional information to this sensor instance.'
										)
										.optional()
								})
							)
							.describe('A beta sensor')
							.optional(),
						gamma: z
							.array(
								z.object({
									value: z
										.number()
										.describe(
											'Observed counts per minute (ocpm) or actual radiation value. If the value are the observed counts then the dead_time and conversion_factor fields must be defined as well. CPM formula: <div>cpm = ocpm ( 1 + 1 / (1 - ocpm x dead_time) )</div> Conversion formula: <div>µSv/h = cpm x conversion_factor</div>'
										),
									unit: z
										.enum(['cpm', 'r/h', 'µSv/h', 'mSv/a', 'µSv/a'])
										.describe('Choose the appropriate unit for your radiation sensor instance.'),
									dead_time: z
										.number()
										.describe(
											'The dead time in µs. See the description of the value field to see how to use the dead time.'
										)
										.optional(),
									conversion_factor: z
										.number()
										.describe(
											'The conversion from the <em>cpm</em> unit to another unit hardly depends on your tube type. See the description of the value field to see how to use the conversion factor. <strong>Note:</strong> only trust your manufacturer if it comes to the actual factor value. The internet seems <a rel="nofollow" href="http://sapporohibaku.wordpress.com/2011/10/15/conversion-factor/" target="_blank">full of wrong copy & pastes</a>, don\'t even trust your neighbour hackerspace. If in doubt ask the tube manufacturer.'
										)
										.optional(),
									location: z
										.string()
										.describe(
											'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
										)
										.optional(),
									name: z
										.string()
										.describe(
											'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
										)
										.optional(),
									description: z
										.string()
										.describe(
											'An extra field that you can use to attach some additional information to this sensor instance.'
										)
										.optional()
								})
							)
							.describe('A gamma sensor')
							.optional(),
						beta_gamma: z
							.array(
								z.object({
									value: z
										.number()
										.describe(
											'Observed counts per minute (ocpm) or actual radiation value. If the value are the observed counts then the dead_time and conversion_factor fields must be defined as well. CPM formula: <div>cpm = ocpm ( 1 + 1 / (1 - ocpm x dead_time) )</div> Conversion formula: <div>µSv/h = cpm x conversion_factor</div>'
										),
									unit: z
										.enum(['cpm', 'r/h', 'µSv/h', 'mSv/a', 'µSv/a'])
										.describe('Choose the appropriate unit for your radiation sensor instance.'),
									dead_time: z
										.number()
										.describe(
											'The dead time in µs. See the description of the value field to see how to use the dead time.'
										)
										.optional(),
									conversion_factor: z
										.number()
										.describe(
											'The conversion from the <em>cpm</em> unit to another unit hardly depends on your tube type. See the description of the value field to see how to use the conversion factor. <strong>Note:</strong> only trust your manufacturer if it comes to the actual factor value. The internet seems <a rel="nofollow" href="http://sapporohibaku.wordpress.com/2011/10/15/conversion-factor/" target="_blank">full of wrong copy & pastes</a>, don\'t even trust your neighbour hackerspace. If in doubt ask the tube manufacturer.'
										)
										.optional(),
									location: z
										.string()
										.describe(
											'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
										)
										.optional(),
									name: z
										.string()
										.describe(
											'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
										)
										.optional(),
									description: z
										.string()
										.describe(
											'An extra field that you can use to attach some additional information to this sensor instance.'
										)
										.optional()
								})
							)
							.describe('A sensor which cannot filter beta and gamma radiation separately.')
							.optional()
					})
					.describe(
						'Compound radiation sensor. Check this <a rel="nofollow" href="https://sites.google.com/site/diygeigercounter/gm-tubes-supported" target="_blank">resource</a>.'
					)
					.optional(),
				humidity: z
					.array(
						z.object({
							value: z.number().describe('The sensor value'),
							unit: z
								.literal('%')
								.describe(
									'The unit of the sensor value. You should always define the unit though if the sensor is a flag of a boolean type then you can of course omit it.'
								),
							location: z
								.string()
								.describe(
									'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
								),
							name: z
								.string()
								.describe(
									'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe('Humidity sensor')
					.optional(),
				beverage_supply: z
					.array(
						z.object({
							value: z.number().describe('The sensor value'),
							unit: z
								.enum(['btl', 'crt'])
								.describe(
									'The unit, either <samp>btl</samp> for bottles or <samp>crt</samp> for crates.'
								),
							location: z
								.string()
								.describe(
									'The location of your sensor such as <samp>Room 1</samp> or <samp>Room 2</samp> or <samp>Room 3</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
								)
								.optional(),
							name: z
								.string()
								.describe(
									'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe('How much Mate and beer is in your fridge?')
					.optional(),
				power_consumption: z
					.array(
						z.object({
							value: z.number().describe('The sensor value'),
							unit: z
								.enum(['mW', 'W', 'VA'])
								.describe(
									'The unit of the sensor value. You should always define the unit though if the sensor is a flag of a boolean type then you can of course omit it.'
								),
							location: z
								.string()
								.describe(
									'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
								),
							name: z
								.string()
								.describe(
									'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe('The power consumption of a specific device or of your whole space.')
					.optional(),
				wind: z
					.array(
						z.object({
							properties: z.object({
								speed: z.object({
									value: z.number().describe('The sensor value'),
									unit: z
										.enum(['m/s', 'km/h', 'kn'])
										.describe(
											'The unit of the sensor value. You should always define the unit though if the sensor is a flag of a boolean type then you can of course omit it.'
										)
								}),
								gust: z.object({
									value: z.number().describe('The sensor value'),
									unit: z
										.enum(['m/s', 'km/h', 'kn'])
										.describe(
											'The unit of the sensor value. You should always define the unit though if the sensor is a flag of a boolean type then you can of course omit it.'
										)
								}),
								direction: z
									.object({
										value: z.number().describe('The sensor value'),
										unit: z
											.literal('°')
											.describe(
												'The unit of the sensor value. You should always define the unit though if the sensor is a flag of a boolean type then you can of course omit it.'
											)
									})
									.describe('The wind direction in degrees.'),
								elevation: z
									.object({
										value: z.number().describe('The sensor value'),
										unit: z
											.literal('m')
											.describe(
												'The unit of the sensor value. You should always define the unit though if the sensor is a flag of a boolean type then you can of course omit it.'
											)
									})
									.describe('Height above mean sea level.')
							}),
							location: z
								.string()
								.describe(
									'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
								),
							name: z
								.string()
								.describe(
									'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe('Your wind sensor.')
					.optional(),
				network_connections: z
					.array(
						z.object({
							type: z
								.enum(['wifi', 'cable', 'spacenet'])
								.describe(
									'This field is optional but you can use it to the network type such as <samp>wifi</samp> or <samp>cable</samp>. You can even expose the number of <a href="https://spacefed.net/wiki/index.php/Spacenet" target="_blank">spacenet</a>-authenticated connections.'
								)
								.optional(),
							value: z.number().describe('The amount of network connections.'),
							machines: z
								.array(
									z.object({
										name: z.string().describe('The machine name.').optional(),
										mac: z
											.string()
											.describe(
												"The machine's MAC address of the format <samp>D3:3A:DB:EE:FF:00</samp>."
											)
									})
								)
								.describe('The machines that are currently connected with the network.')
								.optional(),
							location: z
								.string()
								.describe(
									'The location of your sensor such as <samp>Outside</samp>, <samp>Inside</samp>, <samp>Ceiling</samp>, <samp>Roof</samp> or <samp>Room 1</samp>.'
								)
								.optional(),
							name: z
								.string()
								.describe(
									'This field is an additional field to give your sensor a name. This can be useful if you have multiple sensors in the same location.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe(
						'This sensor type is to specify the currently active  ethernet or wireless network devices. You can create different instances for each network type.'
					)
					.optional(),
				account_balance: z
					.array(
						z.object({
							value: z.number().describe('How much?'),
							unit: z
								.enum(['BTC', 'EUR', 'USD', 'GBP'])
								.describe(
									'What\'s the currency? Please use the ones provided, in the next version you can use currency definitions according to <a href="https://en.wikipedia.org/wiki/ISO_4217" target="_blank">ISO 4217</a>'
								),
							location: z
								.string()
								.describe(
									'If you have more than one account you can use this field to specify where it is.'
								)
								.optional(),
							name: z.string().describe('Give your sensor instance a name.').optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe('How rich is your hackerspace?')
					.optional(),
				total_member_count: z
					.array(
						z.object({
							value: z.number().describe('The amount of your space members.'),
							location: z
								.string()
								.describe(
									'Specify the location if your hackerspace has different departments (for whatever reason). This field is for one department. Every department should have its own sensor instance.'
								)
								.optional(),
							name: z
								.string()
								.describe(
									'You can use this field to specify if this sensor instance counts active or inactive members.'
								)
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe('Specify the number of space members.')
					.optional(),
				people_now_present: z
					.array(
						z.object({
							value: z.number().describe('The amount of present people.'),
							location: z
								.string()
								.describe(
									'If you use multiple sensor instances for different rooms, use this field to indicate the location.'
								)
								.optional(),
							name: z
								.string()
								.describe(
									"Give this sensor a name if necessary at all. Use the location field for the rooms. This field is not intended to be used for names of hackerspace members. Use the field 'names' instead."
								)
								.optional(),
							names: z
								.array(z.string())
								.min(1)
								.describe('List of hackerspace members that are currently occupying the space.')
								.optional(),
							description: z
								.string()
								.describe(
									'An extra field that you can use to attach some additional information to this sensor instance.'
								)
								.optional()
						})
					)
					.describe(
						'Specify the number of people that are currently in your space. Optionally you can define a list of names.'
					)
					.optional()
			})
			.describe(
				'Data of various sensors in your space (e.g. temperature, humidity, amount of Club-Mate left, …). The only canonical property is the <em>temp</em> property, additional sensor types may be defined by you. In this case, you are requested to share your definition for inclusion in this specification.'
			)
			.optional(),
		feeds: z
			.object({
				blog: z
					.object({
						type: z
							.string()
							.describe(
								'Type of the feed, for example <samp>rss</samp>, <samp>atom</atom>, <samp>ical</samp>'
							)
							.optional(),
						url: z.string().describe('Feed URL')
					})
					.optional(),
				wiki: z
					.object({
						type: z
							.string()
							.describe(
								'Type of the feed, for example <samp>rss</samp>, <samp>atom</atom>, <samp>ical</samp>'
							)
							.optional(),
						url: z.string().describe('Feed URL')
					})
					.optional(),
				calendar: z
					.object({
						type: z
							.string()
							.describe(
								'Type of the feed, for example <samp>rss</samp>, <samp>atom</atom>, <samp>ical</samp>'
							)
							.optional(),
						url: z.string().describe('Feed URL')
					})
					.optional(),
				flickr: z
					.object({
						type: z
							.string()
							.describe(
								'Type of the feed, for example <samp>rss</samp>, <samp>atom</atom>, <samp>ical</samp>'
							)
							.optional(),
						url: z.string().describe('Feed URL')
					})
					.optional()
			})
			.describe('Feeds where users can get updates of your space')
			.optional(),
		cache: z
			.object({
				schedule: z
					.enum([
						'm.02',
						'm.05',
						'm.10',
						'm.15',
						'm.30',
						'h.01',
						'h.02',
						'h.04',
						'h.08',
						'h.12',
						'd.01'
					])
					.describe(
						'Cache update cycle. This field must match the basic regular expression <code>^[mhd]\\.[0-9]{2}$</code>, where the first field specifies a unit of time (<code>m</code> for 1 minute, <code>h</code> for 1 hour, <code>d</code> for 1 day), and the second field specifies how many of this unit should be skipped between updates. For example, <samp>m.10</samp> means one updates every 10 minutes, <samp>h.03</samp> means one update every 3 hours, and <samp>d.01</samp> means one update every day.'
					)
			})
			.describe(
				'Specifies options about caching of your SpaceAPI endpoint. Use this if you want to avoid hundreds/thousands of application instances crawling your status.'
			)
			.optional(),
		projects: z
			.array(z.string())
			.describe('Your project sites (links to GitHub, wikis or wherever your projects are hosted)')
			.optional(),
		radio_show: z
			.array(
				z.object({
					name: z.string().describe('The name of the radio show.'),
					url: z
						.string()
						.describe(
							'The stream URL which must end in a filename or a semicolon such as <br><ul><li>http://signal.hackerspaces.org:8090/signal.mp3</li><li>http://85.214.64.213:8060/;</ul>'
						),
					type: z.enum(['mp3', 'ogg']).describe('The stream encoder.'),
					start: z
						.string()
						.describe(
							'Specify the start time by using the <a href="http://en.wikipedia.org/wiki/ISO_8601" target="_blank">ISO 8601</a> standard. This encodes the time as follows: <br><br><ul><li>Combined date and time in UTC: 2013-06-10T10:00Z</li><li>Combined date and time in localtime with the timezone offset: 2013-06-10T12:00+02:00</li><li>Combined date and time in localtime with the timezone offset: 2013-06-10T07:00-03:00</li></ul> The examples refer all to the same time.'
						),
					end: z
						.string()
						.describe(
							'Specify the end time by using the <a href="http://en.wikipedia.org/wiki/ISO_8601" target="_blank">ISO 8601</a> standard. This encodes the time as follows: <br><br><ul><li>Combined date and time in UTC: 2013-06-10T10:00Z</li><li>Combined date and time in localtime with the timezone offset: 2013-06-10T12:00+02:00</li><li>Combined date and time in localtime with the timezone offset: 2013-06-10T07:00-03:00</li></ul> The examples refer all to the same time.'
						)
				})
			)
			.describe('A list of radio shows that your hackerspace might broadcast.')
			.optional()
	})
	.describe('SpaceAPI 0.13');
