from django.core.cache import cache

def invalidate_cache(list_cache_key, instance_cache_key_prefix, instance_ids=None):
    """
    Invalidate both list and specific object cache.
    
    :param list_cache_key: Key for the list endpoint cache (e.g. 'patients_list')
    :param instance_cache_key_prefix: Prefix for instance cache (e.g. 'patient')
    :param instance_ids: IDs of the objects to invalidate. Can be a single ID or list of IDs.
    """
    # Delete the list cache
    cache.delete(list_cache_key)
    
    # Delete individual instance caches
    if instance_ids is not None:
        if isinstance(instance_ids, list):
            keys = [f"{instance_cache_key_prefix}_{i}" for i in instance_ids]
            cache.delete_many(keys)
        else:
            cache.delete(f"{instance_cache_key_prefix}_{instance_ids}")
