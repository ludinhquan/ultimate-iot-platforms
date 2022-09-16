{{/* Default host */}}

{{- define "common.hosts.default" -}}
{{ default "api.monitoring.local" }}
{{- end -}}
