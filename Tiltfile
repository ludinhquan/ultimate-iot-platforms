trigger_mode(TRIGGER_MODE_MANUAL)

IMAGE_PREFIX="io.platform.iot"
SERVICE_EXTERNAL="external-services"
SERVICE_API="iot-platforms"

def api_resource(name):
  return SERVICE_API + '-' + name; 

def external_resource(name):
  return SERVICE_EXTERNAL + '-' + name; 

def get_image(name):
  return IMAGE_PREFIX + '/' + name; 

k8s_yaml(helm('./infra/k8s/deps', name=SERVICE_EXTERNAL))

docker_build(get_image('api-admin'), '.', dockerfile='./apps/api-admin/Dockerfile')
docker_build(get_image('service-datasource'), '.', dockerfile='./apps/service-datasource/Dockerfile')

k8s_yaml(helm('./infra/k8s/services', name=SERVICE_API))

k8s_resource(api_resource('api-admin'), resource_deps=[external_resource('rabbitmq')])
k8s_resource(api_resource('service-datasource'), resource_deps=[external_resource('rabbitmq')])

