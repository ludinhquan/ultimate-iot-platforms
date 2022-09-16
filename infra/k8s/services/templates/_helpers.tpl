
{{- define "common.image.prefix" -}}
{{ default "io.platform.iot" }}
{{- end -}}

{{- define "common.service.prefix" -}}
{{ default "iot-platforms" }}
{{- end -}}

{{- define "common.hosts.default" -}}
{{ default "api.monitoring.io" }}
{{- end -}}
