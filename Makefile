test:
	cd examples/contacts-demo && \
	meteor --settings oap_config.json --port 4000 test-packages office-autopilot
