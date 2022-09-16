k8s_yaml(helm('./infra/k8s/deps', name='services'))

docker_build('dev/api-admin', '.', dockerfile='./apps/api-admin/Dockerfile')
docker_build('dev/service-datasource', '.', dockerfile='./apps/service-datasource/Dockerfile')

k8s_yaml(helm('./infra/k8s/services', name='iot-platforms'))
